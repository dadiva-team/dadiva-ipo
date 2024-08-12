using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class AnsweredQuestionEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public string? NoteText { get; set; }
    public required QuestionEntity Question { get; set; }
    public required AnswerEntity Answer { get; set; }

    public AnsweredQuestion ToDomain()
    {
        return new AnsweredQuestion(
            Question.ToDomain(),
            Answer.ToDomain(),
            NoteText
        );
    }
}