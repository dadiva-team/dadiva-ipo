using System.Text.Json;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.terms;

public interface ITermsRepository
{ 
    public Task<Terms?> GetTerms();
    public Task<Boolean> SubmitTerms(JsonElement terms);
}