using System.Runtime.Serialization;

namespace DadivaAPI.domain;

public enum ResponseType
{
    [EnumMember(Value = "boolean")]
    Boolean,
    [EnumMember(Value = "text")]
    Text
}

public record Question(string Id, string Text, ResponseType Type, string? Options);