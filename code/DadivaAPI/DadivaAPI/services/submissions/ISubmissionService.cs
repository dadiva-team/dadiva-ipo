using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.submissions.dtos;
using FluentResults;
using User = DadivaAPI.domain.user.User;

namespace DadivaAPI.services.form;

public interface ISubmissionService
{
    public Task<Result<SubmitSubmissionExternalInfo>> SubmitSubmission(string donorNic, string language, List<AnsweredQuestionModel> answeredQuestions);
    public Task<Result<List<SubmissionWithLockExternalInfo>>> GetPendingSubmissions(string doctorNic);
    public Task<Result<SubmissionWithLockExternalInfo>> GetPendingSubmissionsByUser(string userNic, string doctorNic);
    public Task<Result<SubmissionHistoryOutputModel>> GetSubmissionHistoryByUser(string nic,string doctorNic, int limit, int skip);
    public Task<Result<bool>> LockSubmission(int submissionId, string doctorNic);
    public Task<Result<bool>> UnlockSubmission(int submissionId, string doctorNic);
    public Task<Result<bool>> UnlockExpiredSubmissions(TimeSpan lockTimeout);
}