using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public class FormEntity
{
    public int Id { get; set; }
    [MaxLength(256)] public required string Title { get; set; }
    public required DateTime Date { get; set; }
    [MinLength(3)] [MaxLength(3)] public required string Language { get; set; }
    public required bool IsActive { get; set; }
    [MaxLength(256)] public string? Reason { get; set; }

    public required List<SubmissionEntity> Submissions { get; set; }

    public required AdminEntity Admin { get; set; }

    public FormEntity? PreviousForm { get; set; }
    
    public required List<RuleEntity> Rules { get; set; }
    public required List<QuestionGroupEntity> QuestionGroups { get; set; }
    public required List<InconsistencyEntity> Inconsistencies { get; set; }
}