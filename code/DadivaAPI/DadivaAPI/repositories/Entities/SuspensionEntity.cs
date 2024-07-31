using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class SuspensionEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public required string? Note { get; set; }
    [MaxLength(256)] public required string? Reason { get; set; }
    [MaxLength(256)] public required DateTime StartDate { get; set; }
    [MaxLength(256)] public required DateTime? EndDate { get; set; }
    [MaxLength(256)] public required string Type { get; set; }
    
    public required DonorEntity Donor { get; set; }
    public required DoctorEntity Doctor { get; set; }
}