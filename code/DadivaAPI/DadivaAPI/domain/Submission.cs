namespace DadivaAPI.domain;

public record Submission(List<AnsweredQuestion> AnsweredQuestions, DateTime SubmissionDate, int ByUserNic, int FormVersion)
{
    public int Id { get; init; }
};