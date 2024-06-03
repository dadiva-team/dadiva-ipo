using DadivaAPI.domain;
using DadivaAPI.repositories.form;
using DadivaAPI.repositories.users;
using DadivaAPI.routes.form.models;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public class FormService(IFormRepository repository, IUsersRepository userRepository) : IFormService
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

    public async Task<Result<Form, Problem>> EditForm(List<QuestionGroupModel> groups, List<RuleModel> rules)
    {

        Form form = new Form
        (
            groups.ConvertAll(QuestionGroupModel.ToDomain).ToList(),
            rules.ConvertAll(RuleModel.ToDomain).ToList()
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
        String currentDate = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss");
        var submission = new Submission(answers.Select(a => new AnsweredQuestion(a.Key, a.Value)).ToList(), currentDate);
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

    public async Task<Result<Dictionary<int, Submission>, Problem>> GetSubmissions()
    {
        return Result<Dictionary<int, Submission>, Problem>.Success(await repository.GetSubmissions());
    }
    
    public async Task<Result<Submission, Problem>> GetSubmission(int nic)
    {
        User? user = await userRepository.GetUserByNic(nic);
        if (user is null)
            return Result<Submission, Problem>.Failure(
                new Problem(
                    "errorGettingSubmission.com",
                    "The user with that nic does not exist",
                    404,
                    "Não foi encontrado nenhum dador registado com esse NIC") //TODO Create Problems types for submission
            );
        Submission? submission = await repository.GetSubmission(nic);
        System.Console.WriteLine(submission);
        if (submission is null)
            return Result<Submission, Problem>.Failure(
                new Problem(
                    "errorGettingSubmission.com",
                    "No submissions found for that user",
                    404,
                    "No submission found for that user ") //TODO Create Problems types for submission
            );

        return Result<Submission, Problem>.Success(submission);
    }
    
    public async Task<Result<Inconsistencies, Problem>> GetInconsistencies()
    {
        return Result<Inconsistencies, Problem>.Success(await repository.GetInconsistencies());
    }
    
    public async Task<Result<bool, Problem>> EditInconsistencies(Inconsistencies inconsistencies)
    {

        return Result<bool, Problem>.Success(await repository.EditInconsistencies(inconsistencies));
    }
}