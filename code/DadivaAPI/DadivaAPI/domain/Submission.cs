using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.submissions.dtos;

namespace DadivaAPI.domain;

public record Submission(
    int Id,
    List<AnsweredQuestion> AnsweredQuestions,
    DateTime SubmissionDate,
    SubmissionStatus Status,
    User Donor,
    Form Form,
    Lock Locked
)
{
    public bool IsFullyAnswered()
    {
        return AnsweredQuestions.All(q => q.Answer.ValidateAnswer());
    }
    
    public SubmissionWithLockExternalInfo ToExternalInfo()
    {
        return new SubmissionWithLockExternalInfo( Id, SubmissionDate, Status, Donor.Nic, Donor.Name, Form.Id, Locked.ToExternalInfo());
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