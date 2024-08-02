namespace DadivaAPI.domain;

public enum Languages
{
    Pt,
    En
}

public record Terms(string CreatedBy, string Content, Languages Language, DateTime CreatedAt);

