using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.routes.form.models;
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
                form.Rules.Select(RuleModel.FromDomain).ToList()
            )
        );
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

    public async Task<Result<bool, Problem>> SubmitForm(Dictionary<string, IAnswer> answers, int nic)
    {
        var submission = new Submission(answers.Select(a => new AnsweredQuestion(a.Key, a.Value)).ToList(), DateTime.Now.ToUniversalTime(), nic);
        bool isSubmitted = await repository.SubmitForm(submission, nic);
        if (isSubmitted) return Result<bool, Problem>.Success(true);

        return Result<bool, Problem>.Failure(
            new Problem(
                "errorSubmitingForm.com",
                "Error submitting form",
                400,
                "An error ocurred while submitting form"
            )); //TODO Create Problems types for form
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


        return Result<Review, Problem>.Success(addedReview);
    }

    public async Task<Result<Dictionary<int, Submission>, Problem>> GetSubmissions()
    {
        return Result<Dictionary<int, Submission>, Problem>.Success(await repository.GetSubmissions());
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
}