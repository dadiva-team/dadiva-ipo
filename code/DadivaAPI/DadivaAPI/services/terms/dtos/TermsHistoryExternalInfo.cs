namespace DadivaAPI.services.terms.dtos;

public record TermsHistoryExternalInfo(
    List<TermsInfo> History
);

public record TermsInfo(
    string Content,
    string Date,
    string? Reason,
    string AuthorName,
    string AuthorNic
);