using DadivaAPI.domain;
using DadivaAPI.services.terms.dtos;
using FluentResults;

namespace DadivaAPI.services.terms;

public interface ITermsService
{
    public Task<Result<TermsExternalInfo>> GetActiveTerms(string language);
    public Task<Result<TermsHistoryExternalInfo>> GetTermsHistory(string language);
    public Task<Result> SubmitTerms(string createdBy, string content, string language, string? Reason);

}