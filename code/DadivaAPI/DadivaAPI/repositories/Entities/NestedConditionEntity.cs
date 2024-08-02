using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public abstract class NestedConditionEntity
{
    public int Id { get; set; }
    
    public abstract Condition ToCondition();
}