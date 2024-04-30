using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models
{
    public record RuleModel
    {
        public Dictionary<string, List<EvaluationModel>> Conditions { get; set; }
        public EventModel Event { get; set; }

        public static RuleModel FromRule(Rule rule)
        {
            var dictionary = new Dictionary<string, List<EvaluationModel>>();
            if (rule.Conditions.TryGetValue(ConditionType.any, out var anyConditions))
                dictionary["any"] = ConvertConditions(anyConditions);
            else if (rule.Conditions.TryGetValue(ConditionType.all, out var allConditions))
                dictionary["all"] = ConvertConditions(allConditions);
            else if (rule.Conditions.TryGetValue(ConditionType.not, out var notConditions))
                dictionary["not"] = ConvertConditions(notConditions);
            return new RuleModel
            {
                Conditions = dictionary,
                Event = new EventModel
                {
                    Type = rule.Event.Type.ToString(),
                    Params = new Params
                    {
                        Id = rule.Event.Params.Id
                    }
                }
            };
        }

        private static List<EvaluationModel> ConvertConditions(List<Evaluation> conditions)
        {
            return conditions.Select(evaluation => new EvaluationModel
            {
                Fact = evaluation.Fact,
                Operator = evaluation.Operator.ToString(),
                Value = evaluation.Value
            }).ToList();
        }

        public Rule ToRule()
        {
            return new Rule
            {
                Conditions = Conditions.Select(pair => new
                    {
                        ConditionType = Enum.TryParse<ConditionType>(pair.Key, true, out var conditionType) 
                            ? conditionType 
                            : throw new ArgumentException($"Invalid condition type key: {pair.Key}"),
                        Evaluations = pair.Value.Select(e => new Evaluation(
                            e.Fact,
                            Enum.Parse<Operator>(e.Operator, true),
                            e.Value
                        )).ToList()
                    })
                    .ToDictionary(x => x.ConditionType, x => x.Evaluations),
                Event = new Event
                {
                    Type = Enum.Parse<EventType>(Event.Type, true),
                    Params = new EventParams(Event.Params.Id)
                }
            };
        }

        private static List<Evaluation> ConvertEvaluations(List<EvaluationModel> evaluations)
        {
            return evaluations.Select(e => new Evaluation
                (
                    e.Fact,
                    Enum.Parse<Operator>(e.Operator, true),
                    e.Value.ToString()
                )
            ).ToList();
        }
    }
    public record EvaluationModel
    {
        public string Fact { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }
    }

    public record EventModel
    {
        public string Type { get; set; }
        public Params Params { get; set; }
    }

    public class Params
    {
        public string Id { get; set; }
    }
}