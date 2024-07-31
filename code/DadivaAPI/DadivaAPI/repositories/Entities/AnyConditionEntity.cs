namespace DadivaAPI.repositories.Entities;

public class AnyConditionEntity : TopLevelConditionEntity
{
    public required List<NestedConditionEntity> Any { get; set; }
}