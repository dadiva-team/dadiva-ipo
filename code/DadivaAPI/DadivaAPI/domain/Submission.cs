namespace DadivaAPI.domain;

public record Submission(List<AnsweredQuestion> AnsweredQuestions, DateTime SubmissionDate, int ByUserNic)
{
    public int Id { get; init; }
};