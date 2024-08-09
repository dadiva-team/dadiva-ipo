namespace DadivaAPI.domain;

public enum TermsLanguages
{
    Pt,
    En
}

public record Terms(string CreatedBy, string Content, TermsLanguages Language, DateTime CreatedAt);

