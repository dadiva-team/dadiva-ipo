using DadivaAPI.repositories.Entities;

namespace DadivaAPI.repositories.submissions;

public interface ISubmissionRepository
{
    public Task<bool> SubmitSubmission(SubmissionEntity submission);
    public Task<bool> UpdateSubmission(SubmissionEntity submission);
    public Task<bool> SubmitReview(ReviewEntity review);
    public Task<List<SubmissionEntity>?> GetPendingSubmissions();

    public Task<SubmissionEntity?> GetSubmissionById(int id);

    public Task<SubmissionEntity?> GetLatestPendingSubmissionByUser(string userNic);

    public Task<(List<ReviewEntity>? Submissions, bool HasMoreSubmissions)> GetSubmissionHistoryByUser(string nic,
        int limit, int skip);

    public Task<LockEntity?> GetLock(int submissionId);

    public Task<bool> LockSubmission(LockEntity lockEntity);

    public Task<bool> UpdatedLockedSubmission(LockEntity lockEntity);

    public Task<bool> UnlockSubmission(LockEntity lockEntity);

    public Task<List<LockEntity>> GetExpiredLocks(TimeSpan timeout);

    public Task<bool> SubmissionExists(int id);

    public Task<(int, int, int)> GetStats(DateTime startDate, DateTime endDate);
}