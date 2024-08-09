using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class QuestionGroupEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public required string Name { get; set; }
    
    //public required FormEntity Form { get; set; }
    public required List<QuestionEntity> Questions { get; set; }

    public QuestionGroup ToDomain()
    {
        return new QuestionGroup(Name, Questions.Select(q => q.ToDomain()).ToList());
    }
}