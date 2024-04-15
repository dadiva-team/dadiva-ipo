using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record GetFormOutputModel(List<QuestionModel> Questions, List<RuleModel> Rules)
{
    public GetFormOutputModel(List<Question> Questions, List<Rule> Rules) :
        this(
            Questions.ConvertAll(question => new QuestionModel(question)),
            Rules.ConvertAll(rule => new RuleModel(rule))
        )
    {
    }
};