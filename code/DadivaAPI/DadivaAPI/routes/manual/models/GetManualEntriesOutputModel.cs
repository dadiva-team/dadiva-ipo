using DadivaAPI.domain;

namespace DadivaAPI.routes.manual.models;

public record ExampleOutputModel(
    string Examples,
    List<string> Criteria
)
{
    public static ExampleOutputModel FromDomain(EntryExample domain)
    {
        return new ExampleOutputModel(domain.Text, domain.Criteria.Select(c => c.Text).ToList());
    }
}

public record ManualEntryOutputModel(
    string GroupName,
    List<ExampleOutputModel> Examples
)
{
    public static ManualEntryOutputModel FromDomain(ManualEntry domain)
    {
        return new ManualEntryOutputModel(domain.Name,
            domain.Examples.Select(ExampleOutputModel.FromDomain).ToList());
    }
}

public record GetManualEntriesOutputModel(
    List<ManualEntryOutputModel> ManualEntries
);