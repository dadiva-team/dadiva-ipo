using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class StringAnswerEntity : AnswerEntity
{
    [MaxLength(256)]
    public string Content { get; set; }

    public override IAnswer ToDomain()
    {
        return new StringAnswer(Content);
    }
}

