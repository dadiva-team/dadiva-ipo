using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record QuestionModel(string QuestionText, List<SubQuestionModel>? SubQuestions = null)
{
    public QuestionModel(Question question) :
        this(
            question.QuestionText,
            question.SubQuestions?.ConvertAll(subQuestion => new SubQuestionModel(subQuestion))
        )
    {
    }
}

public record SubQuestionModel(bool Rule, QuestionModel Question, string ResponseType)
{
    public SubQuestionModel(SubQuestion subQuestion) :
        this(
            subQuestion.Rule,
            new QuestionModel(subQuestion.Question.QuestionText),
            subQuestion.ResponseType.ToString()
        )
    {
    }
}