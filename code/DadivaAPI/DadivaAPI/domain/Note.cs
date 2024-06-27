namespace DadivaAPI.domain;


public record Note(int ReviewId, string QuestionId, string? NoteText)
{
    public int Id { get; init; }
};
