using DadivaAPI.domain;
using DadivaAPI.routes.form.models;

namespace DadivaAPI.routes.form.models
{
    public class QuestionModel
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string Type { get; set; }
        public string? Options { get; set; }

        public QuestionModel() {
        }

        public static QuestionModel FromQuestion(Question question)
        {
            return new QuestionModel
            {
                Id = question.Id,
                Text = question.Text,
                Type = question.Type.ToString(),
                Options = question.Options
            };
        }

        public Question ToQuestion()
        {
            return new Question(
                Id,
                Text,
                Enum.Parse<ResponseType>(Type, true),
                Options
            );
        }
    }
}