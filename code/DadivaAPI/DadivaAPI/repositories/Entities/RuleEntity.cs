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
        
        Console.WriteLine("RuleEntity To Domain, TopLevelCondition " + TopLevelCondition);
        Console.WriteLine("RuleEntity To Domain, Id " + Id);
        
        return new Rule(
            TopLevelCondition.ToDomain() as LogicalCondition, 
            Event.ToDomain()
            );
    }
}