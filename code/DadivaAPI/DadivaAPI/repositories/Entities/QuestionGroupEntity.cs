namespace DadivaAPI.repositories.Entities;

public class QuestionGroupEntity
{
    public int Id { get; set; }
    
    public required FormEntity Form { get; set; }
    public required List<QuestionEntity> Questions { get; set; }
}