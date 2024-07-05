namespace DadivaAPI.routes.form.models
{
    public record GetFormOutputModel(
        List<QuestionGroupModel> Groups,
        List<RuleModel> Rules,
        int FormVersion
    );
}