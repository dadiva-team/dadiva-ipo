using System.Text.Json.Serialization;
using DadivaAPI.repositories.Entities;
using DadivaAPI.utils;

namespace DadivaAPI.domain;

public record AnsweredQuestion(Question Question, [property: JsonConverter(typeof(AnswerConverter))] IAnswer Answer, string? NoteText)
{
    public int Id { get; init; }
    public AnsweredQuestionEntity ToEntity()
    {
        return new AnsweredQuestionEntity
        {
            Id = Id,
            Question = Question.ToEntity(),
            Answer = Answer.ToEntity(),
            NoteText = NoteText
        };
    }
};