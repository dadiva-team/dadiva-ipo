namespace DadivaAPI.routes.terms.models;

public record SubmitTermsInputModel(
    string Content,
    string Language,
    string? Reason
);