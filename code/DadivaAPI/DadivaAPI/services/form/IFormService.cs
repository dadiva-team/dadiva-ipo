using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public interface IFormService
{
    public Task<Result<GetFormOutputModel, Problem>> GetForm();

    public Task<Result<Form, Problem>> EditForm(List<QuestionGroupModel> groups, List<RuleModel> rules, User user);//TODO change response on success, currently Form
    public Task<Result<SubmitFormOutputModel, Problem>> SubmitForm(Dictionary<string,IAnswer> answers, int nic, int formVersion);
    
    public Task<Result<Submission, Problem>> GetSubmission(int id);
    
    public Task<Result<Review, Problem>> ReviewForm(int submissionId, int doctorNic, string status, string? finalNote, List<NoteModel>? noteModels = null);
    
    public Task<Result<Dictionary<int, Submission>, Problem>> GetSubmissions();
    public Task<Result<Inconsistencies, Problem>> GetInconsistencies();

    public Task<Result<Submission?, Problem>> HasPendingSubmissionsByUser(int userNic);
    
    public Task<Result<bool, Problem>> EditInconsistencies(Inconsistencies inconsistencies);
}