using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class AllConditionEntity : TopLevelConditionEntity
{
    public required List<NestedConditionEntity> All { get; set; }

    public override Condition ToDomain()
    {
        if (All[0] is TopLevelConditionEntity)
        {
            return new LogicalCondition( 
                All.Select(condition=> condition.ToDomain()).ToList(), 
                null);
        }
        return All[0].ToDomain();
    }
}