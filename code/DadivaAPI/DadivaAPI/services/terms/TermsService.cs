using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.utils;

namespace DadivaAPI.services.terms;

public class TermsService(IRepository repository) : ITermsService
{
    public async Task<Result<Terms?, Problem>> GetTerms()
    {
        
        Terms? terms = await repository.GetTerms();

        if (terms is null)
            return Result<Terms?, Problem>.Failure(
                new Problem(
                    "errorGetttingTerms.com",
                    "Error getting terms",
                    400,
                    "An error occurred while getting terms"
                )
            );

        return Result<Terms?, Problem>.Success(terms);
    }

    public async Task<Result<bool, Problem>> SubmitTerms(JsonElement terms)
    {
        bool isSubmited = await repository.SubmitTerms(terms);
        
        Console.WriteLine(isSubmited);
        if (isSubmited is true)
            return Result<Boolean, Problem>.Success(isSubmited);


        return Result<Boolean, Problem>.Failure(
            new Problem(
                "errorSubmittingTerms.com",
                "Error submitting terms",
                400,
                "An error occurred while submitting terms"
            )
        );
    }
}