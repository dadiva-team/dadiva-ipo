using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.utils;

namespace DadivaAPI.services.terms;

public interface ITermsService
{
    public Task<Result<List<Terms>, Problem>> GetTerms();
    public Task<Result<Terms, Problem>> GetActiveTerms();
    public Task<Result<bool, Problem>> SubmitTerms(Terms terms);

    public Task<Result<bool, Problem>> UpdateTerms(int termId, int updatedBy, string newContent);
    
    public Task<Result<List<TermsChangeLog>?, Problem>> GetTermsChangeLog(int termId);
}