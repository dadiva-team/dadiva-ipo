using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.utils;

namespace DadivaAPI.services.terms;

public class TermsService(IRepository repository) : ITermsService
{
    public async Task<Result<List<Terms>, Problem>> GetTerms()
    {
        
        List<Terms>? terms = await repository.GetAllTerms();

        if (terms is null || terms.Count == 0)
            return Result<List<Terms>, Problem>.Failure(
                new Problem(
                    "noTermsFound.com",
                    "No terms were found",
                    400,
                    "There are currently no terms"
                )
            );

        return Result<List<Terms>, Problem>.Success(terms);
    }
    
    public async Task<Result<Terms, Problem>> GetActiveTerms()
    {
        
        Terms? terms = await repository.GetActiveTerms();

        if (terms is null)
            return Result<Terms, Problem>.Failure(
                new Problem(
                    "noTermsFound.com",
                    "No terms were found",
                    400,
                    "There are no active terms"
                )
            );

        return Result<Terms, Problem>.Success(terms);
    }

    public async Task<Result<bool, Problem>> SubmitTerms(Terms terms)
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
    
    public async Task<Result<Boolean, Problem>> UpdateTerms(int termId, int updatedBy, string newContent)
    {
        Terms? curTerms = await repository.GetTermsById(termId);
        
        if (curTerms is null)
            return Result<Boolean, Problem>.Failure(
                new Problem(
                    "errorUpdatingTerms.com",
                    "Error updating terms",
                    400,
                    "The terms being updated don't exist"
                )
            );

        TermsChangeLog changes = new(
            curTerms.Id,
            updatedBy,
            DateTime.UtcNow,
            curTerms.Content,
            newContent
        );
        
        curTerms.Content = newContent;

        await repository.UpdateTerms(curTerms, changes);
        return Result<Boolean, Problem>.Success(true);
    }
    
    public async Task<Result<List<TermsChangeLog>, Problem>> GetTermsChangeLog(int termsId)
    {
        Terms? curTerms = await repository.GetTermsById(termsId);
        
        if (curTerms is null)
            return Result<List<TermsChangeLog>, Problem>.Failure(
                new Problem(
                    "errorGettingTermsChangeLog.com",
                    "Error Getting Terms Change Log",
                    400,
                    "The terms you've supplied don't exist"
                )
            );

        List<TermsChangeLog>? changes = await repository.GetTermsChangeLog(termsId);
        
        if(changes is null || changes.Count == 0)
            return Result<List<TermsChangeLog>, Problem>.Failure(
                new Problem(
                    "errorGettingTermsChangeLog.com",
                    "Error Getting Terms Change Log",
                    400,
                    "The terms you've supplied haven't been changed"
                )
            );
        
        return Result<List<TermsChangeLog>, Problem>.Success(changes);
    }
}