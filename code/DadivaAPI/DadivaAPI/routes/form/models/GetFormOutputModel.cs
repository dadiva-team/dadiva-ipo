namespace DadivaAPI.routes.form.models
{
    public record GetFormOutputModel(
        string Language,
        List<QuestionGroupModel> Groups,
        List<RuleModel> Rules
    );
}