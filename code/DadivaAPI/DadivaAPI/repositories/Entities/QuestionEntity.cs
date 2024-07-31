using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class QuestionEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public required string Text { get; set; } 
    [MaxLength(256)] public required string Type { get; set; }
    public List<string>? Options { get; set; }
    
    public required QuestionGroupEntity QuestionGroup { get; set; }
}