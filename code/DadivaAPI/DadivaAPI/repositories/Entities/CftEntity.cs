using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class CftEntity
{
    [Key] [MaxLength(256)] public required string Name { get; set; }
    
    public required ManualEntryEntity ManualEntry { get; set; }
}