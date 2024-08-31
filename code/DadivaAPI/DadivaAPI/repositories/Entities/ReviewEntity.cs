using System.ComponentModel.DataAnnotations;
using DadivaAPI.routes.form.models;

namespace DadivaAPI.repositories.Entities;

public enum ReviewStatus
{
    Approved ,
    Rejected
}

public class ReviewEntity
{
    public int Id { get; set; }
    public required DateTime Date { get; set; }

    [MaxLength(256)] public string? FinalNote { get; set; }
    public required ReviewStatus Status { get; set; }
    public required UserEntity Doctor { get; set; }
    public required SubmissionEntity Submission { get; set; }
}