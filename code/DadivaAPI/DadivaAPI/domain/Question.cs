namespace DadivaAPI.domain;

public enum ResponseType
{
    BOOLEAN,
    TEXT
}

public record Question(string Id, string Text, ResponseType Type, object Options);