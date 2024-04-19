using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models
{
    public record GetFormOutputModel
    {
        [JsonPropertyName("questions")]
        public List<QuestionModel> Questions { get; set; }

        [JsonPropertyName("rules")]
        public List<RuleModel> Rules { get; set; }

        public GetFormOutputModel(List<Question> questions, List<Rule> rules)
        {
            Questions = questions.ConvertAll(question => new QuestionModel(question));
            Rules = rules.ConvertAll(rule => new RuleModel(rule));
        }
    }
}