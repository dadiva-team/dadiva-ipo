namespace DadivaAPI.routes.form.models
{
    public record GetFormWithVersionOutputModel(
        List<QuestionGroupModel> Groups,
        int FormVersion
    );
}