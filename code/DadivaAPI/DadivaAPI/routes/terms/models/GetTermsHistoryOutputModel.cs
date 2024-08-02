namespace DadivaAPI.routes.terms.models;

public record GetTermsHistoryOutputModel
(
    List<TermsInfo> History
);

public record TermsInfo(
    string Content,
    string Date,
    string? Reason,
    string AuthorName,
    string AuthorNic
);