using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class UserEntity
{
    [Key] [MinLength(8)] [MaxLength(8)] public required string Nic { get; set; }
    [MaxLength(256)] public required string Name { get; set; }
    [MaxLength(256)] public required string HashedPassword { get; set; }
    [MaxLength(512)] public string? Token { get; set; }

    //Admin specific
    public List<TermsEntity>? Terms { get; set; }
    public List<FormEntity>? Forms { get; set; }

    //Donor specific
    [MaxLength(256)] public string? PlaceOfBirth { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public bool? IsVerified { get; set; }

    public List<SuspensionEntity>? Suspensions { get; set; }
    public List<SubmissionEntity>? Submissions { get; set; }

    //Differentiator
    public required List<string> Roles { get; set; }
}