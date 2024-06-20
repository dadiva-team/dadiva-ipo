using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public interface IFormService
{
    public Task<Result<GetFormOutputModel, Problem>> GetForm();

    public Task<Result<Form, Problem>> EditForm(List<QuestionGroupModel> groups, List<RuleModel> rules, User user);//TODO change response on success, currently Form
    public Task<Result<bool, Problem>> SubmitForm(Dictionary<string,IAnswer> answers, int nic);
    
    public Task<Result<Dictionary<int, Submission>, Problem>> GetSubmissions();
    public Task<Result<Inconsistencies, Problem>> GetInconsistencies();
    
    public Task<Result<bool, Problem>> EditInconsistencies(Inconsistencies inconsistencies);
}