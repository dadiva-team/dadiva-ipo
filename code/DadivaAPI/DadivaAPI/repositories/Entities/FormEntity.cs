using System.ComponentModel.DataAnnotations;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public class FormEntity
{
    public int Id { get; set; }
    public required DateTime Date { get; set; }
    [MinLength(3)] [MaxLength(3)] public required string Language { get; set; }
    [MaxLength(256)] public string? Reason { get; set; }
    public required List<SubmissionEntity>? Submissions { get; set; }
    public required UserEntity Admin { get; set; }
    public FormEntity? PreviousForm { get; set; }
    public required List<RuleEntity> Rules { get; set; }
    public required List<QuestionGroupEntity> QuestionGroups { get; set; }
    public required List<InconsistencyEntity>? Inconsistencies { get; set; }

    public Form ToDomain()
    {
        return new Form(
            QuestionGroups.Select(qg=>qg.ToDomain()).ToList(),
            Rules.Select(r=>r.ToDomain()).ToList(),
            Enum.Parse<FormLanguages>(Language),
            Admin.ToDomain()
        );
    }
    
    
}