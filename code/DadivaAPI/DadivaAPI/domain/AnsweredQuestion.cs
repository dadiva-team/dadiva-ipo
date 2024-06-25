namespace DadivaAPI.domain;

public record AnsweredQuestion(string QuestionID, IAnswer Answer)
{
    public int Id { get; init; }
};