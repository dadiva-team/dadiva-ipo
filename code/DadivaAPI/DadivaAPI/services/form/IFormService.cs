using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public interface IFormService
{
    public Task<Result<GetFormOutputModel, Problem>> GetForm();

    public Task<Result<Form, Problem>> EditForm(List<QuestionGroupModel> groups, List<RuleModel> rules);//TODO change response on success, currently Form
    Task<Result<bool, Problem>> SubmitForm(Dictionary<string,IAnswer> answers, int nic);
    
    Task<Result<Dictionary<int, Submission>, Problem>> GetSubmissions();
}