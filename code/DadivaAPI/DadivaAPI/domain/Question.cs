namespace DadivaAPI.domain;

public enum ResponseType
{
    boolean,
    text
}

public record Question(string Id, string Text, ResponseType Type, object Options);