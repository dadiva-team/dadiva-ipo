namespace DadivaAPI.domain;

public record Rule(LogicalCondition Conditions, Event Event);

public abstract record Condition;

public record LogicalCondition(List<Condition>? All, List<Condition>? Any)
    : Condition;

public record EvaluationCondition(string Fact, Operator Operator, string Value) : Condition;

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

public record Event(EventType Type, EventParams? Params);

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