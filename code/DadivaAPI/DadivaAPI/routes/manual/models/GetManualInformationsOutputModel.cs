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

public record ManualInformationOutputModel(
    string GroupName,
    List<ExampleOutputModel> Examples
)
{
    public static ManualInformationOutputModel FromDomain(ManualEntry domain)
    {
        return new ManualInformationOutputModel(domain.Name,
            domain.Examples.Select(ExampleOutputModel.FromDomain).ToList());
    }
}

public record GetManualInformationsOutputModel(
    List<ManualInformationOutputModel> ManualInformations
);