namespace DadivaAPI.domain;

public record Terms
{
    public int Id { get; init; }
    public string Title { get; set; }
    public string Content { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
    
    public Terms(string title, string content, int createdBy, DateTime createdAt, bool isActive)
    {
        Title = title;
        Content = content;
        CreatedBy = createdBy;
        CreatedAt = createdAt;
        IsActive = isActive;
    }
};

public record TermsChangeLog(int TermId, int ChangesBy, DateTime ChangedAt, string OldContent, string NewContent)
{
    public int Id { get; init; }
};