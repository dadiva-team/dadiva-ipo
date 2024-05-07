using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record QuestionGroupModel(string name, List<QuestionModel> Questions)
{
    public static QuestionGroupModel FromDomain(QuestionGroup domain)
    {
        return new QuestionGroupModel(
            domain.name,
            domain.Questions.Select(QuestionModel.FromDomain).ToList()
        );
    }
    
    public static QuestionGroup ToDomain(QuestionGroupModel model)
    {
        return new QuestionGroup(
            model.name,
            model.Questions.Select(QuestionModel.ToDomain).ToList()
        );
    }
}