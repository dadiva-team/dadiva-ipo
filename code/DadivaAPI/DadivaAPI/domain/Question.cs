using System.Runtime.Serialization;

namespace DadivaAPI.domain;

public enum ResponseType
{
    boolean,
    text,
    dropdown
}

public record Question(string Id, string Text, ResponseType Type, List<string>? Options);