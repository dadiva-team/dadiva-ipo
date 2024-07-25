namespace DadivaAPI.domain;


public class Submission
{
    public int Id { get; init; }
    public List<AnsweredQuestion> AnsweredQuestions { get; set; }
    public DateTime SubmissionDate { get; set; }
    public int ByUserNic { get; set; }
    public int FormVersion { get; set; }
    public Submission(List<AnsweredQuestion> answeredQuestions, DateTime submissionDate, int byUserNic, int formVersion)
    {
        AnsweredQuestions = answeredQuestions;
        SubmissionDate = submissionDate;
        ByUserNic = byUserNic;
        FormVersion = formVersion;
    }
}


public class SubmissionLock
{
    public int Id { get; init; }
    public int SubmissionId { get; set; }
    public int LockedByDoctorNic { get; set; }
    public DateTime LockDate { get; set; }

    public SubmissionLock(int submissionId, int lockedByDoctorNic, DateTime lockDate)
    {
        SubmissionId = submissionId;
        LockedByDoctorNic = lockedByDoctorNic;
        LockDate = lockDate;
    }
}