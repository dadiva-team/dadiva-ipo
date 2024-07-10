namespace DadivaAPI.routes.form.models;

public record SubmissionHistoryModel{
    public int SubmissionId { get; set; }
    public DateTime SubmissionDate { get; set; }
    public int ByUserNic { get; set; }
    public List<AnsweredQuestionModel> Answers { get; set; }
    public int FormVersion { get; set; }
    public DateTime ReviewDate { get; set; }
    public string ReviewStatus { get; set; }
    public int DoctorNic { get; set; }
}