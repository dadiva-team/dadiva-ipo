using DadivaAPI.domain;
using Microsoft.IdentityModel.Tokens;

namespace DadivaAPI.repositories.Entities;

public class AnyConditionEntity : TopLevelConditionEntity
{
    public required List<NestedConditionEntity> Any { get; set; }

    public override Condition ToDomain()
    {
        return Any.IsNullOrEmpty() ? 
            new LogicalCondition(null , []) : 
            new LogicalCondition(null , Any.Select(e=>e.ToDomain()).ToList());
    }
}