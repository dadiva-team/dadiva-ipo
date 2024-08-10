namespace DadivaAPI.domain;

public record EntryExample(
    string Text,
    List<Criteria> Criteria,
    int? Id = null
);