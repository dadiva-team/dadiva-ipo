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
    [MaxLength(4096)] public required string Content { get; set; } = null!;
    public static AnswerEntity FromDomain(IAnswer answer)
    {
        return answer switch
        {
            StringAnswer sa => new AnswerEntity
            {
                AnswerType = AnswerType.String,
                Content = sa.Content.Substring(0, Math.Min(sa.Content.Length, 1024))
            },
            BooleanAnswer ba => new AnswerEntity
            {
                AnswerType = AnswerType.Boolean,
                Content = ba.Content.ToString()
            },
            StringListAnswer sla => new AnswerEntity
            {
                AnswerType = AnswerType.StringList,
                Content = JsonSerializer.Serialize(sla.Content).Substring(0, Math.Min(JsonSerializer.Serialize(sla.Content).Length, 4096))
            },
            _ => throw new InvalidOperationException("Unknown answer type")
        };
    }

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