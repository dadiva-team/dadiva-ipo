namespace DadivaAPI.routes.form.models;

public record GetSubmissionsOutputModel(List<SubmissionModel> Submissions);

public record SubmissionModel(int Nic, List<AnsweredQuestionModel> Answers, string SubmissionDate);