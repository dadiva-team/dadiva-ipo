using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public enum AnswerType
{
    String,
    Boolean,
    StringList
}

public class AnswerEntity
{
    [Key] public int Id { get; set; }
    [MaxLength(50)] public required AnswerType AnswerType { get; set; }
    public required string Content { get; set; } = default!;

    public IAnswer ToDomain()
    {
        return AnswerType switch
        {
            AnswerType.String => new StringAnswer(Content),
            AnswerType.Boolean => new BooleanAnswer(bool.Parse(Content)),
            AnswerType.StringList => new StringListAnswer(JsonSerializer.Deserialize<List<string>>(Content) ?? new List<string>()),
            _ => throw new InvalidOperationException("Unknown answer type")
        };
    }
}