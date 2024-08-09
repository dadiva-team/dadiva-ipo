using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public record Rule(LogicalCondition Conditions, Event Event)
{
    public RuleEntity ToEntity()
    {
        return new RuleEntity
        {
            Event = Event.ToEntity(),
            TopLevelCondition = Conditions.ToEntity() as TopLevelConditionEntity
        };
    }
};

public abstract record Condition
{
    public abstract NestedConditionEntity ToEntity();
};

public record LogicalCondition(List<Condition>? All, List<Condition>? Any)
    : Condition
{ 
    public override NestedConditionEntity ToEntity()
    {
        if (All is not null)
            return new AllConditionEntity
            {
                All = All.Select(c => c.ToEntity()).ToList()
            };
        return new AnyConditionEntity
        {
            Any = Any.Select(c => c.ToEntity()).ToList()
        };
    }
}

public record EvaluationCondition(string Fact, Operator Operator, string Value) : Condition
{
    public override NestedConditionEntity ToEntity()
    {
        return new ConditionPropertiesEntity
        {
            Fact = Fact,
            Operator = Operator.ToString(),
            Value = Value
        };
    }
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

public record Event(EventType Type, EventParams? Params)
{
    public EventEntity ToEntity()
    {
        return new EventEntity
        {
            EventType = Type.ToString(),
            Target = Params.Id,
        };
    }
};

public enum EventType
{
    showQuestion,
    nextGroup,
    showReview,
    hideQuestion,
    showInconsistency,
}

public record EventParams(
    string Id
);