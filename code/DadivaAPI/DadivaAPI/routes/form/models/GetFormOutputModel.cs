using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record GetFormOutputModel(List<QuestionModel> Questions)
{
    public GetFormOutputModel(List<Question> Questions) :
        this(Questions.ConvertAll(question => new QuestionModel(question)))
    {
    }
};