using System.ComponentModel.DataAnnotations;
using DadivaAPI.routes.form.models;

namespace DadivaAPI.repositories.Entities;

public class ReviewEntity
{
    public int Id { get; set; }
    public required DateTime Date { get; set; }
    [MaxLength(256)] public required string Status { get; set; }
    [MaxLength(256)] public string? FinalNote { get; set; }
    
    public required UserEntity Doctor { get; set; }
    public required SubmissionEntity Submission { get; set; }
}

