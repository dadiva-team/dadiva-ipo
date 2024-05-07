using System.Runtime.Serialization;

namespace DadivaAPI.domain;

public enum ResponseType
{
    boolean,
    text
}

public record Question(string Id, string Text, ResponseType Type, string? Options);