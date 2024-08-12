using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public enum TermsLanguages
{
    Pt,
    En
}

public record Terms(user.User CreatedBy, string Content, TermsLanguages Language, DateTime CreatedAt)
{
    public TermsEntity ToEntity(TermsEntity? previousTerms, string? reason)
    {
        return new TermsEntity
        {
            Date = CreatedAt,
            Reason = reason,
            Language = Language.ToString(),
            Admin = CreatedBy.ToEntity(),
            Content = Content,
            PreviousTerms = previousTerms
        };
    }
}

