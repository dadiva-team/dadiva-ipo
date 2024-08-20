using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class QuestionEntity
{
    [MaxLength(36)]public string Id { get; set; }
    [MaxLength(256)] public required string Text { get; set; } 
    [MaxLength(256)] public required string Type { get; set; }
    public List<string>? Options { get; set; }
    
    public QuestionGroupEntity? QuestionGroup { get; set; }

    public Question ToDomain()
    {
        Enum.TryParse<ResponseType>(Type, true, out var parsedType);
        return new Question(Id, Text, parsedType, Options);

    }
}