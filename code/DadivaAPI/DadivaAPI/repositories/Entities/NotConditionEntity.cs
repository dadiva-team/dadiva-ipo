namespace DadivaAPI.repositories.Entities;

public class NotConditionEntity : TopLevelConditionEntity
{
    public required NestedConditionEntity Not { get; set; }
}