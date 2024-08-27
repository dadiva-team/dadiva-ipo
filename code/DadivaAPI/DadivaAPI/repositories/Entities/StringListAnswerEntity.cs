using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class StringListAnswerEntity : AnswerEntity
{
    public List<StringAnswerEntity> Content { get; set; }

    public override IAnswer ToDomain()
    {
        return new StringListAnswer(Content.Select(c => c.Content).ToList());
    }
}
