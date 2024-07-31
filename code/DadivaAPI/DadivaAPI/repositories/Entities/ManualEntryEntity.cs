using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class ManualEntryEntity
{
    [Key] [MaxLength(256)] public required string Name { get; set; }
        
    public required List<CftEntity> Cfts { get; set; }
    public required List<EntryExampleEntity> EntryExamples { get; set; }
}