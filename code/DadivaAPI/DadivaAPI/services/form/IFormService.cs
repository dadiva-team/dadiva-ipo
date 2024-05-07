using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public interface IFormService
{
    public Task<Result<GetFormOutputModel, Problem>> GetForm();

    public Task<Result<Form, Problem>> SubmitForm(List<QuestionGroupModel> groups, List<RuleModel> rules);//TODO change response on success, currently Form
}