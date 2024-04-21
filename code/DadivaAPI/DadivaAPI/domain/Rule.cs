using System.Text.Json.Serialization;

namespace DadivaAPI.domain;

public record Rule(
    Dictionary<ConditionType, List<Evaluation>> Conditions,
    Event Event
);

public enum ConditionType
{
    any,
    all,
    not
}


public enum Operator
{
    equal,
    notEqual,
    lessThan,
    lessThanInclusive,
    greaterThan,
    greaterThanInclusive,
    @in,
    notIn,
    contains,
    doesNotContain
}

public record Evaluation
{
    [JsonPropertyName("fact")]
    public string Fact { get; init; }

    [JsonPropertyName("operator")]
    public Operator Operator { get; init; }

    [JsonPropertyName("value")]
    public string Value { get; init; }

    public Evaluation(string fact, Operator @operator, string value)
    {
        Fact = fact;
        Operator = @operator;
        Value = value;
    }
};

public enum EventType
{
    showQuestion,
    hideQuestion
}
public record Event(
    EventType Type,
    EventParams Params
);

public record EventParams(
    string Id
);