using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class CriteriaEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public required string Text { get; set; }
    
    public required EntryExampleEntity EntryExample { get; set; }
}