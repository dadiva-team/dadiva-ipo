using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record QuestionModel(string Id, string Text, ResponseType Type, object? Option = null)
{
    public QuestionModel(Question question) :
        this(
            question.Id,
            question.Text,
            question.Type,
            question.Options
        )
    {
    }
}