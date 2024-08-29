using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public record Inconsistencies(
    List<Rule> InconsistencyList,
    string? Reason,
    DateTime Date,
    user.User Admin,
    Form Form
)
{
    public InconsistencyEntity ToEntity()
    {
        // Convert the Inconsistencies to a list of RuleEntity objects
        var ruleEntities = InconsistencyList.Select(r => r.ToEntity()).ToList();

        return new InconsistencyEntity
        {
            Date = Date,
            Reason = Reason,
            Rules = ruleEntities,
            Admin = DomainToFromEntityExtensions.ToEntity(Admin),
            Form = this.Form.ToEntity(null, Form.AddedBy.ToEntity(), Reason)
        };
    }
}


/*public record Inconsistencies(
    List<Rule> InconsistencyList
);*/