using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class EventEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public required string Target { get; set; }
    [MaxLength(256)] public required string EventType { get; set; }
    
    public required RuleEntity Rule { get; set; }
}