namespace DadivaAPI.routes.form.models;

public record GetSubmissionsOutputModel(List<SubmissionModelWithLockInfo> Submissions);
public record  SubmissionModelWithLockInfo(SubmissionModel Submission, int? LockedByDoctorNic);
public record SubmissionModel(int Id, int Nic, List<AnsweredQuestionModel> Answers, string SubmissionDate, int FormVersion);