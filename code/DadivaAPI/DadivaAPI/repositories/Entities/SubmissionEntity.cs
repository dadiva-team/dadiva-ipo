namespace DadivaAPI.repositories.Entities;

public class SubmissionEntity
{
    public int Id { get; set; }
    public required DateTime Date { get; set; }
    
    public required DonorEntity Donor { get; set; }
    
    public DoctorEntity? LockedBy { get; set; }
    
    public required FormEntity Form { get; set; }
    
    public required List<AnsweredQuestionEntity> AnsweredQuestions { get; set; }
}