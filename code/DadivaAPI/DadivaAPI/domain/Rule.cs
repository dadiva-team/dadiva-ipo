namespace DadivaAPI.domain;

public record Rule(
    Dictionary<ConditionType, List<Evaluation>> Condition,
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

public record Evaluation(
    string Fact,
    Operator Operator,
    string Value
);

public enum EventType
{
    showQuestion,
    hideQuestion
}
public record Event(
    EventType Type,
    List<EventParams> Params
);

public record EventParams(
    string Id
);