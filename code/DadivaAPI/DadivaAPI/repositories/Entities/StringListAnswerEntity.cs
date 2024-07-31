namespace DadivaAPI.repositories.Entities;

public class StringListAnswerEntity : AnswerEntity
{
    public required List<StringAnswerEntity> Content { get; set; }
}