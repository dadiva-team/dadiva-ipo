namespace DadivaAPI.repositories.Entities;

public class SubmissionEntity
{
    public int Id { get; set; }
    public required DateTime Date { get; set; }
    
    public required UserEntity Donor { get; set; }
    
    public UserEntity? LockedBy { get; set; }
    
    public required FormEntity Form { get; set; }
    
    public required List<AnsweredQuestionEntity> AnsweredQuestions { get; set; }
}