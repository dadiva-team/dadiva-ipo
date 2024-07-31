using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class AnsweredQuestionEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public string? NoteText { get; set; }
    
    public required QuestionEntity Question { get; set; }
    public required AnswerEntity Answer { get; set; }
}