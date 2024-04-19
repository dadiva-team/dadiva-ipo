using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models
{
    public class QuestionModel
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("text")]
        public string Text { get; set; }

        [JsonPropertyName("type")]
        public ResponseType Type { get; set; }

        [JsonPropertyName("options")]
        public object? Option { get; set; }

        public QuestionModel(Question question)
        {
            Id = question.Id;
            Text = question.Text;
            Type = question.Type;
            Option = question.Options;
        }
    }
}