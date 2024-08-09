using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public enum FormLanguages
{
    Pt,
    En
}

public record Form(
    List<QuestionGroup> Groups,
    List<Rule> Rules,
    FormLanguages Language,
    user.User AddedBy
    )
{
    public int Id { get; init; }

    public FormEntity ToEntity(FormEntity? previousForm, string? reason)
    {
        return new FormEntity
        {
            Date = DateTime.Now.ToUniversalTime(),
            Reason = reason,
            Language = Language.ToString(),
            Admin = AddedBy.ToEntity(),
            Inconsistencies = null,
            PreviousForm = previousForm,
            QuestionGroups = Groups.Select(g => g.ToEntity()).ToList(), //not ideal, replicates question groups that are already in form
            Rules = Rules.Select(r => r.ToEntity()).ToList(), //not ideal, replicates rules that are already in form
            Submissions = null
        };
    }
};