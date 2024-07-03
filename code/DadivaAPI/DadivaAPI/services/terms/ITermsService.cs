using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.utils;

namespace DadivaAPI.services.terms;

public interface ITermsService
{
    public Task<Result<Terms?, Problem>> GetTerms();

    public Task<Result<bool, Problem>> SubmitTerms(JsonElement terms);
}