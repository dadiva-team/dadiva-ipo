namespace DadivaAPI.domain;

public record AnsweredQuestion(string QuestionId, IAnswer Answer )
{
    public int Id { get; init; }
};