using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using DadivaAPI.domain;
using DadivaAPI.utils;

namespace DadivaAPI.repositories.Entities;

public class AnsweredQuestionEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public string? NoteText { get; set; }
    public required QuestionEntity Question { get; set; }
    [JsonConverter(typeof(AnswerConverter))] public required AnswerEntity Answer { get; set; }

    public AnsweredQuestion ToDomain()
    {
        return new AnsweredQuestion(
            Question.ToDomain(),
            Answer.ToDomain(),
            NoteText
        )
        {
            Id = Id
        };
    }
}