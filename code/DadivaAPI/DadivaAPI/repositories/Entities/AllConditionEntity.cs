using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class AllConditionEntity : TopLevelConditionEntity
{
    public required List<NestedConditionEntity> All { get; set; }

    public override Condition ToCondition()
    {
        if (All[0] is TopLevelConditionEntity)
        {
            return new LogicalCondition( 
                All.Select(condition=> condition.ToCondition()).ToList(), 
                null);
        }
        return All[0].ToCondition();
    }
}