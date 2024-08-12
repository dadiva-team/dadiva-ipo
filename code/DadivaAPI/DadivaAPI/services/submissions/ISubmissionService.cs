using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.submissions.dtos;
using FluentResults;
using User = DadivaAPI.domain.user.User;

namespace DadivaAPI.services.form;

public interface ISubmissionService
{
    public Task<Result<List<SubmissionWithLockExternalInfo>>> GetPendingSubmissions();
    public Task<Result<SubmissionWithLockExternalInfo>> GetPendingSubmissionsByUser(string userNic);
    public Task<Result<SubmissionHistoryOutputModel>> GetSubmissionHistoryByUser(string nic, int limit, int skip);
    public Task<Result<bool>> LockSubmission(int submissionId, string doctorNic);
    public Task<Result<bool>> UnlockSubmission(int submissionId, string doctorNic);
    public Task<Result<bool>> UnlockExpiredSubmissions(TimeSpan lockTimeout);
}