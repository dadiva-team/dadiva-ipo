using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public interface IFormService
{
    public Task<Result<GetFormResponse, Problem>> GetForm();

    public Task<Result<bool, Problem>> SubmitForm(List<QuestionModel> questions, List<RuleModel> rules);//TODO change response on success, currently bool
}