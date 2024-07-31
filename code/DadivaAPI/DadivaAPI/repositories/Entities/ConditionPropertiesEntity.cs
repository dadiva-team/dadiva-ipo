using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class ConditionPropertiesEntity : NestedConditionEntity
{
    [MaxLength(256)] public required string Operator { get; set; }
    [MaxLength(256)] public required string Fact { get; set; }
    [MaxLength(256)] public required string Value { get; set; }
}