namespace DadivaAPI.repositories.Entities;

public class RuleEntity
{
    public int Id { get; set; }
    
    public FormEntity? Form { get; set; }
    public InconsistencyEntity? Inconsistency { get; set; }
    
    public required List<EventEntity> Events { get; set; }
    public required TopLevelConditionEntity TopLevelCondition { get; set; }
}