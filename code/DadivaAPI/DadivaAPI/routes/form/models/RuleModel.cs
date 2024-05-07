using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record RuleModel(Dictionary<string, List<EvaluationModel>> Conditions, EventModel Event)
{
    public static RuleModel FromDomain(Rule rule)
    {
        return new RuleModel(
            rule.Conditions.ToDictionary(
                pair =>
                {
                    Console.Out.WriteLine(pair.Key.ToString());
                    return pair.Key.ToString();
                },
                pair => pair.Value.Select(EvaluationModel.FromDomain).ToList()
            ),
            EventModel.FromDomain(rule.Event)
        );
    }

    public static Rule ToDomain(RuleModel model)
    {
        return new Rule
        (
            model.Conditions.ToDictionary(
                pair => Enum.Parse<ConditionType>(pair.Key),
                pair => pair.Value.Select(EvaluationModel.ToDomain).ToList()
            ),
            EventModel.ToDomain(model.Event)
        );
    }
};

public record EvaluationModel(string Fact, string Operator, string Value)
{
    public static EvaluationModel FromDomain(Evaluation evaluation)
    {
        return new EvaluationModel(
            evaluation.Fact,
            evaluation.Operator.ToString(),
            evaluation.Value
        );
    }

    public static Evaluation ToDomain(EvaluationModel model)
    {
        return new Evaluation
        (
            model.Fact,
            Enum.Parse<Operator>(model.Operator),
            model.Value
        );
    }
};

public record EventParamsModel(
    string Id
);

public record EventModel(string Type, EventParamsModel Params)
{
    public static EventModel FromDomain(Event domain)
    {
        return new EventModel(
            domain.Type.ToString(),
            new EventParamsModel(domain.Params.Id)
        );
    }
    public static Event ToDomain(EventModel model)
    {
        return new Event
        (
            Enum.Parse<EventType>(model.Type),
            new EventParams(model.Params.Id)
        );
    }
};