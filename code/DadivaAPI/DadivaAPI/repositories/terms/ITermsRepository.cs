using DadivaAPI.repositories.Entities;

namespace DadivaAPI.repositories.terms;

public interface ITermsRepository
{ 
    public Task<TermsEntity?> GetActiveTerms(string language);
    public Task<List<TermsEntity>?> GetTermsHistory(string language);
    public Task<TermsEntity?> GetTermsById(int id);
    public Task<bool> SubmitTerms(TermsEntity terms);
}