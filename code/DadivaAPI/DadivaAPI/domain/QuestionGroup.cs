using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public record QuestionGroup(string name, List<Question> Questions)
{
    public QuestionGroupEntity ToEntity()
    {
        return new QuestionGroupEntity
        {
            Name = name,
            Questions = Questions.Select(q=>q.ToEntity()).ToList()
        };
    }
};