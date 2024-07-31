using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class StringAnswerEntity : AnswerEntity
{
    [MaxLength(256)] public required string Content { get; set; }
}