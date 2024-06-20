namespace DadivaAPI.domain;

public record Submission(List<AnsweredQuestion> AnsweredQuestions, string SubmissionDate)
{
    public int Id { get; init; }
};