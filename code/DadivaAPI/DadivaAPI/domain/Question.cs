using System.Runtime.Serialization;

namespace DadivaAPI.domain;

public enum ResponseType
{
    boolean,
    text,
    dropdown
}

public record ShowCondition
{
    public List<string>? After { get; set; }
    public Dictionary<string, string>? If { get; set; }
}

public record Question(string Id, string Text, ResponseType Type, List<string>? Options, ShowCondition? ShowCondition);


