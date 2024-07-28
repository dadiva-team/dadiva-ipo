using DadivaAPI.domain;

namespace DadivaAPI.services.form.dtos;

public class SubmissionPendingDto
{
    public int Id { get; set; }
    public int ByUserNic { get; set; }
    public List<AnsweredQuestion> Answers { get; set; }
    public DateTime SubmissionDate { get; set; }
    public int FormVersion { get; set; }
    public int? LockedByDoctorNic { get; set; }
}