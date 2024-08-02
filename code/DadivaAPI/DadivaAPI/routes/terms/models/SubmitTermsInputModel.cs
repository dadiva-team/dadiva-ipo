namespace DadivaAPI.routes.terms.models;

public record SubmitTermsInputModel(
    string CreatedBy,
    string Content,
    string Language,
    string? Reason
);