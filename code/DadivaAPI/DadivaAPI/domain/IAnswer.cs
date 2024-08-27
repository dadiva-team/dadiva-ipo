using System.Text.Json;
using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public interface IAnswer
{
    bool ValidateAnswer();
    AnswerEntity ToEntity();
}

public record StringAnswer(string Content) : IAnswer
{
    public bool ValidateAnswer()
    {
        return Content.Length > 0;
    }
    public AnswerEntity ToEntity()
    {
        return new StringAnswerEntity
        {
            Content = this.Content
        };
    }
}

public record BooleanAnswer(bool Content) : IAnswer
{
    public bool ValidateAnswer()
    {
        return true;
    }
    public AnswerEntity ToEntity()
    {
        return new BooleanAnswerEntity
        {
            Content = this.Content
        };
    }
}

public record StringListAnswer(List<string> Content) : IAnswer
{
    public bool ValidateAnswer()
    {
        return Content != null && Content.Count > 0 && Content.All(s => !string.IsNullOrEmpty(s));
    }

    public AnswerEntity ToEntity()
    {
        return new StringListAnswerEntity
        {
            Content = this.Content.Select(s => new StringAnswerEntity { Content = s }).ToList()
        };
    }
}
