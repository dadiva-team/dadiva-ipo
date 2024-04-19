using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models
{
    public class RuleModel
    {
        [JsonPropertyName("conditions")]
        public Dictionary<ConditionType, List<Evaluation>> Condition { get; set; }

        [JsonPropertyName("event")]
        public Event Event { get; set; }

        public RuleModel(Rule rule)
        {
            Condition = rule.Conditions;
            Event = new Event(rule.Event);
        }
    }
}