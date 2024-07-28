using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form.dtos;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public interface IFormService
{
    public Task<Result<GetFormOutputModel, Problem>> GetForm();
    
    public Task<Result<GetFormWithVersionOutputModel, Problem>> GetFormWithVersion(int version);

    public Task<Result<Form, Problem>> EditForm(List<QuestionGroupModel> groups, List<RuleModel> rules, User user);//TODO change response on success, currently Form
    public Task<Result<SubmitFormOutputModel, Problem>> SubmitForm(Dictionary<string,IAnswer> answers, int nic, int formVersion);
    
    public Task<Result<Submission, Problem>> GetSubmission(int id);
    
    public Task<Result<bool, Problem>> LockSubmission(int submissionId, int doctorId);
    public Task<Result<bool, Problem>> UnlockSubmission(int submissionId, int doctorId);
    public Task UnlockExpiredSubmissions(TimeSpan lockTimeout);
    public Task<Result<Review, Problem>> ReviewForm(int submissionId, int doctorNic, string status, string? finalNote, List<NoteModel>? noteModels = null);
    
    public Task<Result<List<SubmissionModelWithLockInfo>, Problem>> GetPendingSubmissions();
    public Task<Result<Inconsistencies, Problem>> GetInconsistencies();

    public Task<Result<SubmissionModelWithLockInfo?, Problem>> GetPendingSubmissionsByUserNic(int userNic);
    
    public Task<Result<SubmissionHistoryOutputModel, Problem>> GetSubmissionHistoryByNic(int nic, int limit, int skip);
    
    public Task<Result<bool, Problem>> EditInconsistencies(Inconsistencies inconsistencies);
}