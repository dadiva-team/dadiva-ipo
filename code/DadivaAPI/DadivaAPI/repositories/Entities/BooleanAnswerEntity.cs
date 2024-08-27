using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class BooleanAnswerEntity : AnswerEntity
{
    public bool Content { get; set; }

    public override IAnswer ToDomain()
    {
        return new BooleanAnswer(Content);
    }
}

