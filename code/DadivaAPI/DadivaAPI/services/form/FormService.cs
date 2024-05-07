using DadivaAPI.domain;
using DadivaAPI.repositories.form;
using DadivaAPI.routes.form.models;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public class FormService(IFormRepository repository) : IFormService
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

    public async Task<Result<Form, Problem>> SubmitForm(List<QuestionGroupModel> groups, List<RuleModel> rules)
    {
        Form form = new Form
        {
            Groups = groups.ConvertAll(QuestionGroupModel.ToDomain).ToList(),
            Rules = rules.ConvertAll(RuleModel.ToDomain).ToList()
        };

        return Result<Form, Problem>.Success(await repository.SubmitForm(form));
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
}