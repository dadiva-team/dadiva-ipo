using System.Text.Json;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.terms;

public interface ITermsRepository
{ 
    public Task<List<Terms>?> GetAllTerms();
    public Task<Terms?> GetActiveTerms();
    public Task<Terms?> GetTermsById(int id);
    public Task<bool> UpdateTerms(Terms terms, TermsChangeLog changes);
    public Task<Boolean> SubmitTerms(Terms terms);
    public Task<List<TermsChangeLog>?> GetTermsChangeLog(int termsId);
}