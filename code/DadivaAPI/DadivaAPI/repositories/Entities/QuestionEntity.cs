using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class QuestionEntity
{
    [Key] public int Id { get; set; }

    [MaxLength(36)] public string OriginalId { get; set; }
    [MaxLength(256)] public required string Text { get; set; } 
    [MaxLength(256)] public required string Type { get; set; }
    public List<string>? Options { get; set; }
    
    public QuestionGroupEntity? QuestionGroup { get; set; }

    public Question ToDomain()
    {
        Enum.TryParse<ResponseType>(Type, true, out var parsedType);
        return new Question(OriginalId, Text, parsedType, Options);

    }
}