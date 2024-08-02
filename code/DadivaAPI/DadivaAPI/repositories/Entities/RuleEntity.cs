using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class RuleEntity
{
    public int Id { get; set; }
    
    public FormEntity? Form { get; set; }
    public InconsistencyEntity? Inconsistency { get; set; }
    
    public required EventEntity Event { get; set; }
    public required TopLevelConditionEntity TopLevelCondition { get; set; }

    public Rule ToDomain()
    {
        return new Rule(
            TopLevelCondition.ToCondition() as LogicalCondition, 
            Event.ToDomain()
            );
    }
}