namespace DadivaAPI.domain;

public record Rule(Dictionary<ConditionType, List<Evaluation>> Conditions, Event Event);

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

public record Evaluation(string Fact, Operator Operator, string Value);

public record Event(EventType Type, EventParams Params);

public enum EventType
{
    showQuestion,
    nextGroup,
    showReview,
    hideQuestion
}

public record EventParams(
    string Id
);