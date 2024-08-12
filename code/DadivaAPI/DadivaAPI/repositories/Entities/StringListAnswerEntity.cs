namespace DadivaAPI.repositories.Entities;

public class StringListAnswerEntity : AnswerEntity
{
    public required List<StringAnswerEntity> ListStringContent { get; set; }
}