namespace DadivaAPI.domain;

public record Rule
{

        public Dictionary<ConditionType, List<Evaluation>> Conditions { get; set; }
        public Event Event { get; set; }

};

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
    public string Fact { get; init; }
    
    public Operator Operator { get; init; }
    
    public string Value { get; init; }

    public Evaluation(string fact, Operator @operator, string value)
    {
        Fact = fact;
        Operator = @operator;
        Value = value;
    }
};

public record Event
{
    public EventType Type { get; set; }
    public EventParams Params { get; set; }

};

public enum EventType
{
    showQuestion,
    hideQuestion
}

public record EventParams(
    string Id
);