using DadivaAPI.domain;
using DadivaAPI.routes.form.models;

namespace DadivaAPI.services.form.dtos;

public class SubmissionHistoryDto
{
    public int SubmissionId { get; set; }
    public DateTime SubmissionDate { get; set; }
    public int ByUserNic { get; set; }
    public List<AnsweredQuestion> Answers { get; set; }
    public string? FinalNote { get; set; }
    public int FormVersion { get; set; }
    public DateTime ReviewDate { get; set; }
    public List<NoteDto> Notes { get; set; }
    public string ReviewStatus { get; set; }
    public int DoctorNic { get; set; }
}