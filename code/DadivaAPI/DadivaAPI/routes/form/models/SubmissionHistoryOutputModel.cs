namespace DadivaAPI.routes.form.models;

public record SubmissionHistoryOutputModel
{
    public List<SubmissionHistoryModel> SubmissionHistory { get; set; }
    public bool HasMoreSubmissions { get; set; }
}