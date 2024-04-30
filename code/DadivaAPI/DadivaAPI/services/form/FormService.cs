using DadivaAPI.domain;
using DadivaAPI.repositories.form;
using DadivaAPI.routes.form.models;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public class FormService(IFormRepository repository) : IFormService
{
    public async Task<Result<GetFormResponse, Problem>> GetForm()
    {
        Form? form = await repository.GetForm();
        
        if(form is null) return Result<GetFormResponse, Problem>.Failure(
            new Problem(
                "errorGettingForm.com",
                "Error getting form",
                400,
                "An error occurred while getting form")//TODO Create Problems types for form
            );
        
        return Result<GetFormResponse, Problem>.Success(new GetFormResponse(
            form.Questions,
            form.Rules
            )
        );
    }
    
    public async Task<Result<bool, Problem>> SubmitForm(List<QuestionModel> questions, List<RuleModel> rules)
    {
        Form form = new Form
        {
            Questions = questions.ConvertAll<Question>(questionModel => questionModel.ToQuestion()),
            Rules = rules.ConvertAll(ruleModel => ruleModel.ToRule())
        };

        bool isSubmited = await repository.SubmitForm(form);

        if (isSubmited) return Result<bool, Problem>.Success(true);
        return Result<bool, Problem>.Failure(
            new Problem(
                "errorSubmitingForm.com",
                "Error submitting form" ,
                400,
                "An error ocurred while submitting form"
                ));//TODO Create Problems types for form
    }
}