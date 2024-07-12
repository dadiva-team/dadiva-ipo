using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.repositories.users;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form.dtos;
using DadivaAPI.utils;
using Elastic.Clients.Elasticsearch;

namespace DadivaAPI.services.form;

public class FormService(IRepository repository) : IFormService
{
    public async Task<Result<GetFormOutputModel, Problem>> GetForm()
    {
        Form? form = await repository.GetForm();
        if (form is null)
            return Result<GetFormOutputModel, Problem>.Failure(
                new Problem(
                    "errorGettingForm.com",
                    "Error getting form",
                    400,
                    "An error occurred while getting form") //TODO Create Problems types for form
            );

        return Result<GetFormOutputModel, Problem>.Success(new GetFormOutputModel(
                form.Groups.Select(QuestionGroupModel.FromDomain).ToList(),
                form.Rules.Select(RuleModel.FromDomain).ToList(),
                form.Id
            )
        );
    }
    
    public async Task<Result<GetFormWithVersionOutputModel, Problem>> GetFormWithVersion(int version)
    {
        Form? form = await repository.GetFormWithVersion(version);
        if (form is null)
            return Result<GetFormWithVersionOutputModel, Problem>.Failure(
                new Problem(
                    "errorGettingFormWithVersion.com",
                    "Error getting form with version $version",
                    400,
                    "An error occurred while getting form") //TODO Create Problems types for form
            );

        return Result<GetFormWithVersionOutputModel, Problem>.Success(new GetFormWithVersionOutputModel(
            form.Groups.Select(QuestionGroupModel.FromDomain).ToList(),
            form.Id
        ));
    }

    public async Task<Result<Form, Problem>> EditForm(List<QuestionGroupModel> groups, List<RuleModel> rules, User user)
    {

        Form form = new Form
        (
            groups.ConvertAll(QuestionGroupModel.ToDomain).ToList(),
            rules.ConvertAll(RuleModel.ToDomain).ToList(),
            user,
            DateTime.Now.ToUniversalTime()
        );

        return Result<Form, Problem>.Success(await repository.EditForm(form));
        /*
        if (isSubmited) return Result<bool, Problem>.Success(true);
        return Result<bool, Problem>.Failure(
            new Problem(
                "errorSubmitingForm.com",
                "Error submitting form",
                400,
                "An error ocurred while submitting form"
            )); //TODO Create Problems types for form
            */
    }

    public async Task<Result<SubmitFormOutputModel, Problem>> SubmitForm(Dictionary<string, IAnswer> answers, int nic, int formVersion)
    {
        var submission = new Submission(answers.Select(a => new AnsweredQuestion(a.Key, a.Value)).ToList(), DateTime.Now.ToUniversalTime(), nic, formVersion);
        bool isSubmitted = await repository.SubmitForm(submission);
        if (isSubmitted)
        {
            var userAccountStatus = await repository.GetUserAccountStatus(nic);
            if (userAccountStatus != null)
            {
                userAccountStatus.Status = AccountStatus.PendingReview;
                userAccountStatus.LastSubmissionDate = submission.SubmissionDate;
                userAccountStatus.LastSubmissionId = submission.Id;
                await repository.UpdateUserAccountStatus(userAccountStatus);
            }

            return Result<SubmitFormOutputModel, Problem>.Success(new SubmitFormOutputModel(
                submission.SubmissionDate, submission.Id));
        }

        return Result<SubmitFormOutputModel, Problem>.Failure(
            new Problem(
                "errorSubmitingForm.com",
                "Error submitting form",
                400,
                "An error ocurred while submitting form"
            ));
    }

    public async Task<Result<Submission, Problem>> GetSubmission(int id)
    {
        Submission? submission = await repository.GetSubmission(id);
        if (submission == null)
            return Result<Submission, Problem>.Failure(
                new Problem(
                    "errorGettingSubmission.com",
                    "Error getting submission",
                    404,
                    "An error occurred while getting submission") //TODO Create Problems types for form
            );
        return Result<Submission, Problem>.Success(submission);
    }
    
    public async Task<Result<Review, Problem>> ReviewForm(int submissionId, int doctorNic, string status, string? finalNote, List<NoteModel>? noteModels = null)
    {
        // Probably not needed
        
        Console.WriteLine("ReviewForm");
        Console.WriteLine(submissionId);
        Console.WriteLine(doctorNic);
        Console.WriteLine(status);
        Console.WriteLine(finalNote);
        Console.WriteLine(noteModels);
        
        Submission? submission = await repository.GetSubmissionById(submissionId);
        /*
        if (submission == null)
            return Result<Review, Problem>.Failure(
                new Problem(
                    "errorGettingSubmission.com",
                    "Error getting submission",
                    404,
                    "An error occurred while getting submission") //TODO Create Problems types for form
            );*/
        
        var review = new Review(
            submissionId,doctorNic,
            status,
            finalNote,
            DateTime.UtcNow
        );
        
        var addedReview = await repository.AddReview(review);
        
        if (noteModels != null && noteModels.Any())
        {
            foreach (var note in noteModels)
            {
                var newNote = new Note(
                    addedReview.Id,
                    note.QuestionId,
                    note.NoteText
                );

                await repository.AddNote(newNote);
            }
        }
        var userAccountStatus = await repository.GetUserAccountStatus(submission.ByUserNic);
        if (userAccountStatus != null)
        {
            userAccountStatus.Status = AccountStatus.Active;
            await repository.UpdateUserAccountStatus(userAccountStatus);
        }


        return Result<Review, Problem>.Success(addedReview);
    }

    public async Task<Result<Dictionary<int, Submission>, Problem>> GetSubmissions()
    {
        return Result<Dictionary<int, Submission>, Problem>.Success(await repository.GetSubmissions());
    }
    
    public async Task<Result<Submission?, Problem>> GetPendingSubmissionsByUserNic(int userNic)
    {
        var pendingSubmission = await repository.GetLatestPendingSubmissionByUser(userNic);
    
        if (pendingSubmission == null)
            return Result<Submission?, Problem>.Failure(
                new Problem(
                    "noPendingSubmission.com",
                    "No pending submission",
                    404,
                    "The user has no pending submissions")
            );

        return Result<Submission?, Problem>.Success(pendingSubmission);
    }
    
    private SubmissionHistoryModel ConvertToOutputModel(SubmissionHistoryDto dto)
    {
        return new SubmissionHistoryModel
        {
            SubmissionId = dto.SubmissionId,
            SubmissionDate = dto.SubmissionDate,
            ByUserNic = dto.ByUserNic,
            Answers = dto.Answers.Select(AnsweredQuestionModel.FromDomain).ToList(),
            FinalNote = dto.FinalNote,
            FormVersion = dto.FormVersion,
            Notes = dto.Notes,
            ReviewDate = dto.ReviewDate,
            ReviewStatus = dto.ReviewStatus,
            DoctorNic = dto.DoctorNic
        };
    }

    public async Task<Result<SubmissionHistoryOutputModel, Problem>> GetSubmissionHistoryByNic(int nic, int limit, int skip)
    {
        var (submissionHistoryDtos, hasMoreSubmissions) = await repository.GetSubmissionHistoryByNic(nic, limit, skip);

        if (submissionHistoryDtos == null || !submissionHistoryDtos.Any())
        {
            return Result<SubmissionHistoryOutputModel, Problem>.Failure(
                new Problem(
                    "noSubmissionHistory.com",
                    "No submission history",
                    404,
                    "The user has no submission history")
            );
        }

        var submissionHistoryModels = submissionHistoryDtos.Select(dto => 
        {
            var outputModel = ConvertToOutputModel(dto);
            return outputModel;
        }).ToList();

        return Result<SubmissionHistoryOutputModel, Problem>.Success(
            new SubmissionHistoryOutputModel
            {
                SubmissionHistory = submissionHistoryModels,
                HasMoreSubmissions = hasMoreSubmissions
            } );
    }
    
    public async Task<Result<Inconsistencies, Problem>> GetInconsistencies()
    {
        Inconsistencies? inconsistencies = await repository.GetInconsistencies();
        if (inconsistencies == null)
            inconsistencies = new Inconsistencies(new List<Rule>());
        return Result<Inconsistencies, Problem>.Success(inconsistencies);
    }
    
    public async Task<Result<bool, Problem>> EditInconsistencies(Inconsistencies inconsistencies)
    {

        return Result<bool, Problem>.Success(await repository.EditInconsistencies(inconsistencies));
    }

    public async Task<Result<Terms?, Problem>> GetTerms()
    {
        Terms? terms = null;
        if (terms is not null)
            return Result<Terms, Problem>.Success(terms);

        return Result<Terms, Problem>.Failure(
            new Problem(
                "IllegalTerms.com",
                "These terms are illegal",
                404,
                "The terms are illegal you go to jail"
            )
        );
    }
}