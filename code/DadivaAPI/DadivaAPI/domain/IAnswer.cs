using System.Text.Json;
using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public interface IAnswer
{
    bool ValidateAnswer();
    
    public static AnswerEntity ToEntity(IAnswer answer)
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
}

public record StringAnswer(string Content) : IAnswer
{
    public bool ValidateAnswer()
    {
        return Content.Length > 0;
    }
}

public record BooleanAnswer(bool Content) : IAnswer
{
    public bool ValidateAnswer()
    {
        return true;
    }
}

public record StringListAnswer(List<string> Content) : IAnswer
{
    public bool ValidateAnswer()
    {
        return Content.All(s => s.Length > 0);
    }
}