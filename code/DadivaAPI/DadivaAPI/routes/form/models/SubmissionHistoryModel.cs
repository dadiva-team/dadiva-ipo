using DadivaAPI.services.form.dtos;

namespace DadivaAPI.routes.form.models;

public record SubmissionHistoryModel{
    public int SubmissionId { get; set; }
    public DateTime SubmissionDate { get; set; }
    public int ByUserNic { get; set; }
    public List<AnsweredQuestionModel> Answers { get; set; }
    public string? FinalNote { get; set; }
    public int FormVersion { get; set; }
    public List<NoteDto> Notes { get; set; }
    public DateTime ReviewDate { get; set; }
    public string ReviewStatus { get; set; }
    public int DoctorNic { get; set; }
}