using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;
using DadivaAPI.services.submissions.dtos;

namespace DadivaAPI.domain;

public record Inconsistencies(
    List<Rule> InconsistencyList,
    string? Reason,
    DateTime Date,
    user.User Admin,
    Form Form
)
{
    public int Id { get; init; }
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
    
    public static Inconsistencies? CreateMinimalSubmissionDomain(MinimalInconsistencyDto? inconsistencyDto)
    {
        if (inconsistencyDto is null) return null;
        var donorUser = User.CreateMinimalUser(inconsistencyDto.Admin);
        var form = Form.CreateMinimalForm(inconsistencyDto.Form, donorUser);

        return new Inconsistencies(
            inconsistencyDto.Rules.Select(r => r.ToDomain()).ToList(),
            inconsistencyDto.Reason,
            inconsistencyDto.Date,
            donorUser,
            form
        )
        {
            Id = inconsistencyDto.Id
        };
    }
}
