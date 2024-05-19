using System.Text.Json.Serialization;
using DadivaAPI.domain;
using DadivaAPI.utils;

namespace DadivaAPI.routes.form.models
{
    [JsonConverter(typeof(ConditionModelConverter))]
    public abstract class ConditionModel
    {
        protected static List<ConditionModel>? FromDomain(List<Condition>? conditions)
        {
            return conditions?.Select<Condition, ConditionModel>(condition =>
            {
                return condition switch
                {
                    EvaluationCondition evalCondition => new EvaluationConditionModel(evalCondition.Fact,
                        evalCondition.Operator.ToString(), evalCondition.Value),
                    LogicalCondition logCondition => LogicalConditionModel.FromDomain(logCondition),
                    _ => throw new Exception("Never going to happen, c# doesn't have proper sealed classes")
                };
            }).ToList();
        }

        protected static List<Condition>? ToDomain(List<ConditionModel>? models)
        {
            return models?.Select<ConditionModel, Condition>(model =>
            {
                return model switch
                {
                    EvaluationConditionModel evalModel => new EvaluationCondition(
                        Fact: evalModel.Fact,
                        Operator: Enum.Parse<Operator>(evalModel.Operator),
                        Value: evalModel.Value
                    ),
                    LogicalConditionModel logModel => LogicalConditionModel.ToDomain(logModel),
                    _ => throw new Exception("Never going to happen, c# doesn't have proper sealed classes")
                };
            }).ToList();
        }
    }

    public class EvaluationConditionModel : ConditionModel
    {
        public string Fact { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }

        [JsonConstructor]
        public EvaluationConditionModel(string fact, string @operator, string value)
        {
            Fact = fact;
            Operator = @operator;
            Value = value;
        }
    }

    public class LogicalConditionModel : ConditionModel
    {
        public List<ConditionModel>? All { get; set; }
        public List<ConditionModel>? Any { get; set; }
        

        [JsonConstructor]
        public LogicalConditionModel(List<ConditionModel>? all, List<ConditionModel>? any)
        {
            All = all;
            Any = any;
        }

        public static LogicalConditionModel FromDomain(LogicalCondition conditions)
        {
            return new LogicalConditionModel(
                ConditionModel.FromDomain(conditions.All),
                ConditionModel.FromDomain(conditions.Any)
            );
        }

        public static LogicalCondition ToDomain(LogicalConditionModel model)
        {
            return new LogicalCondition(
                All: ConditionModel.ToDomain(model.All),
                Any: ConditionModel.ToDomain(model.Any)
            );
        }
    }

    public class RuleModel
    {
        public LogicalConditionModel Conditions { get; set; }
        public EventModel Event { get; set; }

        [JsonConstructor]
        public RuleModel(LogicalConditionModel conditions, EventModel @event)
        {
            Conditions = conditions;
            Event = @event;
        }

        public static RuleModel FromDomain(Rule rule)
        {
            return new RuleModel(
                LogicalConditionModel.FromDomain(rule.Conditions),
                EventModel.FromDomain(rule.Event)
            );
        }

        public static Rule ToDomain(RuleModel model)
        {
            return new Rule(
                Conditions: LogicalConditionModel.ToDomain(model.Conditions),
                Event: EventModel.ToDomain(model.Event)
            );
        }
    }

    public class EventModel
    {
        public string Type { get; set; }
        public EventParamsModel? Params { get; set; }

        [JsonConstructor]
        public EventModel(string type, EventParamsModel? @params)
        {
            Type = type;
            Params = @params;
        }

        public static EventModel FromDomain(Event e)
        {
            return new EventModel(
                e.Type.ToString(),
                EventParamsModel.FromDomain(e.Params)
            );
        }

        public static Event ToDomain(EventModel model)
        {
            return new Event(
                Type: Enum.Parse<EventType>(model.Type),
                Params: EventParamsModel.ToDomain(model.Params)
            );
        }
    }

    public class EventParamsModel
    {
        public string Id { get; set; }

        [JsonConstructor]
        public EventParamsModel(string id)
        {
            Id = id;
        }

        public static EventParamsModel? FromDomain(EventParams? eParams)
        {
            return eParams == null ? null : new EventParamsModel(eParams.Id);
        }

        public static EventParams? ToDomain(EventParamsModel? model)
        {
            return model == null ? null : new EventParams(model.Id);
        }
    }
}
