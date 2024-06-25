namespace DadivaAPI.domain;

public record Inconsistencies(List<Rule> InconsistencyList)
{
    public int Id { get; init; }
};