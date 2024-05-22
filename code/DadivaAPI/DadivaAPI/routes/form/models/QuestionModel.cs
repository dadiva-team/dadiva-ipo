using DadivaAPI.domain;
using DadivaAPI.routes.form.models;

namespace DadivaAPI.routes.form.models;

public record QuestionModel(string Id, string Text, string Type, List<string>? Options, ShowCondition? ShowCondition)
{
    public static QuestionModel FromDomain(Question question)
    {
        return new QuestionModel(
            question.Id,
            question.Text,
            question.Type.ToString(),
            question.Options,
            question.ShowCondition
        );
    }

    public static Question ToDomain(QuestionModel model)
    {
        return new Question(
            model.Id,
            model.Text,
            Enum.Parse<ResponseType>(model.Type),
            model.Options,
            model.ShowCondition
        );
    }
}