namespace DadivaAPI.domain;


public class Submission
{
    public int Id { get; init; }
    public List<AnsweredQuestion> AnsweredQuestions { get; set; }
    public DateTime SubmissionDate { get; set; }
    public int ByUserNic { get; set; }
    public int FormVersion { get; set; }
    public int? LockedByDoctorNic { get; set; }

    public Submission(List<AnsweredQuestion> answeredQuestions, DateTime submissionDate, int byUserNic, int formVersion, int? lockedByDoctorNic)
    {
        AnsweredQuestions = answeredQuestions;
        SubmissionDate = submissionDate;
        ByUserNic = byUserNic;
        FormVersion = formVersion;
        LockedByDoctorNic = lockedByDoctorNic;
    }
}