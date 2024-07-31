using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class DonorEntity : UserEntity
{
    [MaxLength(256)] public required string PlaceOfBirth { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required bool IsVerified { get; set; }

    public required List<SuspensionEntity> Suspensions { get; set; }
    public required List<SubmissionEntity> Submissions { get; set; }
}