using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public enum SubmissionStatus
{
    Pending,
    Approved,
    Rejected
}

public class SubmissionEntity
{
    public int Id { get; set; }
    public required DateTime Date { get; set; }
    public required UserEntity Donor { get; set; }
    public LockEntity? LockedBy { get; set; }
    public required FormEntity Form { get; set; }
    public required SubmissionStatus Status { get; set; }
    
    public required SubmissionLanguages Language { get; set; }
    public required List<AnsweredQuestionEntity> AnsweredQuestions { get; set; }
}