using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public record AnsweredQuestion(Question Question, IAnswer Answer, string? NoteText)
{
    public int Id { get; init; }
    public AnsweredQuestionEntity ToEntity()
    {
        return new AnsweredQuestionEntity
        {
            Question = Question.ToEntity(),
            Answer = Answer.ToEntity(),
            NoteText = NoteText
        };
    }
};