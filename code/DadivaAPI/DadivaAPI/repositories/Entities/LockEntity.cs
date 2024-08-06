using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public enum LockEntityType
{
    submission,
    form,
    terms
}

public class LockEntity
{
    [Key] public int Id { get; set; }
    
    public required int EntityId { get; set; }
    
    public required LockEntityType LockEntityType { get; set; }
    
    [MaxLength(8)] public required UserEntity Doctor { get; set; }
    
    [MaxLength(256)] public required DateTime LockDate { get; set; }

    public Lock ToDomain()
    {
        return new Lock(Id, EntityId, LockEntityType, Doctor.ToDomain(), LockDate);
    }
}