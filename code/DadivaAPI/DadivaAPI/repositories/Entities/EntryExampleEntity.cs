using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class EntryExampleEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public required string Text { get; set; }
    
    public required ManualEntryEntity ManualEntry { get; set; }
    
    public required List<CriteriaEntity> Criterias { get; set; }
}