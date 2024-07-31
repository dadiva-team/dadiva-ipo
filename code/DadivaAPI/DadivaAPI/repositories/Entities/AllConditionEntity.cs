namespace DadivaAPI.repositories.Entities;

public class AllConditionEntity : TopLevelConditionEntity
{
    public required List<NestedConditionEntity> All { get; set; }
}