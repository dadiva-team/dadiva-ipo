using System.Runtime.Serialization;
using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public enum ResponseType
{
    boolean,
    text,
    dropdown,
    medications,
    countries
}

public record Question(string Id, string Text, ResponseType Type, List<string>? Options)
{
    public QuestionEntity ToEntity()
    {
        return new QuestionEntity
        {
            OriginalId = Id,
            Options = Options,
            Text = Text,
            Type = Type.ToString()
        };
    }
};


