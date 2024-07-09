using DadivaAPI.domain;

namespace DadivaAPI.routes.manual.models;

public record ExampleOutputModel(
    string Examples,
    List<string> Criteria
)
{
    public static ExampleOutputModel FromDomain(Example domain)
    {
        return new ExampleOutputModel(domain.Examples, domain.Criteria);
    }
}

public record ManualInformationOutputModel(
    string GroupName,
    List<ExampleOutputModel> Examples
)
{
    public static ManualInformationOutputModel FromDomain(ManualInformation domain)
    {
        return new ManualInformationOutputModel(domain.GroupName,
            domain.Examples.Select(ExampleOutputModel.FromDomain).ToList());
    }
}

public record GetManualInformationsOutputModel(
    List<ManualInformationOutputModel> ManualInformations
);