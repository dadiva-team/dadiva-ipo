using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class AnyConditionEntity : TopLevelConditionEntity
{
    public required List<NestedConditionEntity> Any { get; set; }

    public override Condition ToDomain()
    {
        if (Any[0] is TopLevelConditionEntity)
        {
            return new LogicalCondition(
                null,
                Any.Select(condition => condition.ToDomain()).ToList()
            );
        }
        return Any[0].ToDomain();
    }
}