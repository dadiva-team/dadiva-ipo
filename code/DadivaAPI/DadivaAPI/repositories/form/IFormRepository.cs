using DadivaAPI.repositories.Entities;

namespace DadivaAPI.repositories.form;

public interface IFormRepository
{
    public Task<FormEntity> GetForm();
    
    public Task<FormEntity?> GetFormWithVersion(int version);
    
    public Task<FormEntity> EditForm(FormEntity form);
    
    public Task<bool> SubmitForm(SubmissionEntity submission);
    
    public Task<List<SubmissionEntity>?> GetPendingSubmissions();
    
    public Task<SubmissionEntity> GetSubmission(int nic);
    public Task<SubmissionEntity?> GetSubmissionById(int id);

    public Task<SubmissionEntity?> GetLatestPendingSubmissionByUser(int userNic);

    public Task<(List<SubmissionEntity>? Submissions, bool HasMoreSubmissions)> GetSubmissionHistoryByNic(int nic, int limit, int skip);
    
    public Task<InconsistencyEntity> GetInconsistencies();
    
    public Task<bool> LockSubmission(int submissionId, int doctorId);
    
    public Task<bool> UnlockSubmission(int submissionId, int doctorId);

    public Task<List<SubmissionEntity>> GetExpiredLocks(TimeSpan timeout);

    public Task<bool> SubmissionExists(int id);
    public Task<ReviewEntity> AddReview(ReviewEntity review);
    
    public Task<bool> AddNote(string note, int submissionId);
    public Task<bool> EditInconsistencies(InconsistencyEntity inconsistencies);
}