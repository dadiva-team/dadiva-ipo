using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class InconsistencyEntity
{
    public int Id { get; set; }
    public required DateTime Date { get; set; }
    [MaxLength(256)] public List<string>? Reason { get; set; }
    
    public required List<RuleEntity> Rules { get; set; }
    
    public required UserEntity Admin { get; set; }
    
    public required FormEntity Form { get; set; }

    public Inconsistencies ToDomain()
    {
        return new Inconsistencies(
            Rules.Select(r => r.ToDomain()).ToList(), 
            Reason,
            Date,
            Admin.ToDomain(),
            Form.ToDomain()
        );
    }
}