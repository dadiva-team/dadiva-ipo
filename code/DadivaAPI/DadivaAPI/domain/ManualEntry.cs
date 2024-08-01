namespace DadivaAPI.domain;

public record ManualEntry(
    string Name,
    List<EntryExample> Examples
);