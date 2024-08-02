using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.services.terms.dtos;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.services.terms;

public class TermsService(IRepository repository, DbContext context) : ITermsService
{
    public async Task<Result<TermsExternalInfo>> GetActiveTerms(string language)
    {
        return await context.WithTransaction(async () =>
        {
            if (!Enum.TryParse<Languages>(language, out var parsedLanguage))
            {
                return Result.Fail(new TermsErrors.InvalidLanguageError());
            }

            var termsEntity = await repository.GetActiveTerms(language);

            //defaulting to english terms if desired language isn't available, questionable
            if (termsEntity is null && language != "en")
            {
                termsEntity = await repository.GetActiveTerms("en");
            }

            if (termsEntity is null) return Result.Fail(new TermsErrors.NoTermsError());

            return Result.Ok(
                new TermsExternalInfo(termsEntity.Content)
            );
        });
    }
    
    public async Task<Result<TermsHistoryExternalInfo>> GetTermsHistory(string language)
    {
        return await context.WithTransaction(async () =>
        {
            if (!Enum.TryParse<Languages>(language, out var parsedLanguage))
            {
                return Result.Fail(new TermsErrors.InvalidLanguageError());
            }

            var history = await repository.GetTermsHistory(language);
            
            if (history is null) return Result.Fail(new TermsErrors.NoTermsError());
            
            return Result.Ok(
                new TermsHistoryExternalInfo(
                    history.Select(info=> new TermsInfo(
                        info.Content,
                        info.Date.ToString(),
                        info.Reason,
                        info.Admin.Name,
                        info.Admin.Nic
                        )).ToList())
            );
        });
    }


    public async Task<Result> SubmitTerms(string createdBy, string content, string language, string? reason)
    {
        return await context.WithTransaction(async () =>
        {
            if (!Enum.TryParse<Languages>(language, out var parsedLanguage))
            {
                return Result.Fail(new TermsErrors.InvalidLanguageError());
            }
            
            
            var success = await repository.SubmitTerms(content, language, reason);

            return success ? Result.Ok() : Result.Fail(new TermsErrors.UnknownTermsError());
        });
    }
}