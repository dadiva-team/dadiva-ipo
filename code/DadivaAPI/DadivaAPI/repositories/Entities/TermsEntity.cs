using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DadivaAPI.repositories.Entities;

public class TermsEntity
{
    public int Id { get; set; }
    [MaxLength(8192)] public required string Content { get; set; }
    public required DateTime Date { get; set; }
    [MinLength(3)] [MaxLength(3)] public required string Language { get; set; }
    [MaxLength(256)] public required string? Reason { get; set; }
    
    public TermsEntity? PreviousTerms { get; set; }
    
    public required UserEntity Admin { get; set; }
}