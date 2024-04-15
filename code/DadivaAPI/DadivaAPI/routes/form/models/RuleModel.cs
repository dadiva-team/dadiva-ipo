using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record RuleModel(Dictionary<ConditionType, List<Evaluation>> Condition, Event Event)
{
    public RuleModel(Rule rule) :
        this(
            rule.Condition,
            rule.Event
        )
    {
    }
}