using System.Runtime.InteropServices.JavaScript;
using DadivaAPI.domain;
using Microsoft.IdentityModel.Tokens;

namespace DadivaAPI.repositories.Entities;

public class AllConditionEntity : TopLevelConditionEntity
{
    public required List<NestedConditionEntity> All { get; set; }

    public override Condition ToDomain()
    {
        return All.IsNullOrEmpty() ? 
            new LogicalCondition([] , null) : 
            new LogicalCondition(All.Select(e=>e.ToDomain()).ToList() , null);
    }
}