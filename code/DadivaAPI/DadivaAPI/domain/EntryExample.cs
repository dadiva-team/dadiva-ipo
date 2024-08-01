namespace DadivaAPI.domain;

public record EntryExample(
    string Test,
    List<Criteria> Criteria,
    int? Id = null
);