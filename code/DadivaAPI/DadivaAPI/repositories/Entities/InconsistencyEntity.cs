using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class InconsistencyEntity
{
    public int Id { get; set; }
    public required DateTime Date { get; set; }
    [MaxLength(256)] public required string Reason { get; set; }
    
    public required List<RuleEntity> Rules { get; set; }
    
    public required UserEntity Admin { get; set; }
    
    public required FormEntity Form { get; set; }
    
}