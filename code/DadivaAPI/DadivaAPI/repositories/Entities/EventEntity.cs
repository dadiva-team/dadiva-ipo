using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class EventEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [MaxLength(256)] public required string? Target { get; set; }
    [MaxLength(256)] public required string EventType { get; set; }
    
    //public required RuleEntity Rule { get; set; }

    public Event ToDomain()
    {
        Enum.TryParse<EventType>(EventType, out var parsedType);
        return new Event(parsedType,
            new EventParams(Target)
        );
    }
}