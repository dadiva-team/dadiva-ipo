using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class ConditionPropertiesEntity : NestedConditionEntity
{
    [MaxLength(256)] public required string Operator { get; set; }
    [MaxLength(256)] public required string Fact { get; set; }
    [MaxLength(256)] public required string Value { get; set; }
    
    public override Condition ToDomain()
    {
        if (!Enum.TryParse<Operator>(Operator, out var parsedOperator))
            throw new Exception("Invalid operator");
        
        return new EvaluationCondition(Fact, parsedOperator, Value);
    }
}