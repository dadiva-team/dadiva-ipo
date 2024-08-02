using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using FluentResults;
using User = DadivaAPI.domain.user.User;

namespace DadivaAPI.services.form;

public interface IFormService
{
    public Task<Result<GetFormOutputModel>> GetForm();
    public Task<Result<SubmitFormOutputModel>> SubmitForm(Dictionary<string,IAnswer> answers, int nic, int formVersion);
    public Task<Result<Submission>> GetSubmission(int id);
    public Task<Result<bool>> LockSubmission(int submissionId, int doctorId);
    public Task<Result<bool>> UnlockSubmission(int submissionId, int doctorId);
    public Task UnlockExpiredSubmissions(TimeSpan lockTimeout);
    public Task<Result<Review>> ReviewForm(int submissionId, int doctorNic, string status, string? finalNote, List<NoteModel>? noteModels = null);
    public Task<Result<List<SubmissionModelWithLockInfo>>> GetPendingSubmissions();
    public Task<Result<Inconsistencies>> GetInconsistencies();

    public Task<Result<SubmissionModelWithLockInfo?>> GetPendingSubmissionsByUserNic(int userNic);
    
    public Task<Result<SubmissionHistoryOutputModel>> GetSubmissionHistoryByNic(int nic, int limit, int skip);
    
    public Task<Result<bool>> EditInconsistencies(Inconsistencies inconsistencies);
}