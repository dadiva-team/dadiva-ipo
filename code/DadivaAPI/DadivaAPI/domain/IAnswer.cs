using System.Text.Json;
using System.Text.RegularExpressions;
using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public interface IAnswer
{
    bool ValidateAnswer();
    AnswerEntity ToEntity();
    IAnswer Sanitize();
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

    public IAnswer Sanitize()
    {
        var sanitizedContent = SanitizeInput(Content);
        return new StringAnswer(sanitizedContent);
    }

    private string SanitizeInput(string input)
    {
        if (string.IsNullOrEmpty(input)) return input;

        var sanitizedValue = input.Trim();
        sanitizedValue = Regex.Replace(sanitizedValue, @"\s+", " ");
        sanitizedValue = sanitizedValue.Replace("'", "''");

        return sanitizedValue;
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

    public IAnswer Sanitize()
    {
        return this;
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

    public IAnswer Sanitize()
    {
        var sanitizedContent = Content.Select(s => SanitizeInput(s)).ToList();
        return new StringListAnswer(sanitizedContent);
    }

    private string SanitizeInput(string input)
    {
        if (string.IsNullOrEmpty(input)) return input;

        var sanitizedValue = input.Trim();
        sanitizedValue = sanitizedValue.Replace("'", "''");
        return sanitizedValue;
    }
}