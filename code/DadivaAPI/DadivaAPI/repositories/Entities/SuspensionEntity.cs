using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;
using DadivaAPI.domain.user;

namespace DadivaAPI.repositories.Entities;

public class SuspensionEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public required string? Note { get; set; }
    [MaxLength(256)] public required string? Reason { get; set; }
    [MaxLength(256)] public required DateTime StartDate { get; set; }
    [MaxLength(256)] public required DateTime? EndDate { get; set; }
    [MaxLength(256)] public required string Type { get; set; }
    public bool IsActive { get; set; }

    public required UserEntity Donor { get; set; }
    public required UserEntity Doctor { get; set; }
    
    public Suspension ToDomain()
    {
        return new Suspension(
            Donor.ToDomain(),
            Doctor.ToDomain(),
            StartDate,
            Enum.Parse<SuspensionType>(Type),
            IsActive,
            Note,
            Reason,
            EndDate,
            Id
        );
    }
}