using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.services.terms.dtos;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.services.terms;

public class TermsService(IRepository repository, DadivaDbContext context) : ITermsService
{
    public async Task<Result<TermsExternalInfo>> GetActiveTerms(string language)
    {
        return await context.WithTransaction(async () =>
        {
            if (!Enum.TryParse<TermsLanguages>(language, out var parsedLanguage))
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
            if (!Enum.TryParse<TermsLanguages>(language, out var parsedLanguage))
            {
                return Result.Fail(new TermsErrors.InvalidLanguageError());
            }

            var history = await repository.GetTermsHistory(language);

            if (history is null) return Result.Fail(new TermsErrors.NoTermsError());

            return Result.Ok(
                new TermsHistoryExternalInfo(
                    history.Select(info => new TermsInfo(
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
            var userEntity = await repository.GetUserByNic(createdBy);
            if (userEntity is null)
            {
                return Result.Fail(new UserError.UnknownAdminError());
            }
            
            if (!Enum.TryParse<TermsLanguages>(language, out var parsedLanguage))
            {
                return Result.Fail(new TermsErrors.InvalidLanguageError());
            }

            var currentTerms = await repository.GetActiveTerms(language);
            var termsEntity = new TermsEntity
            {
                Content = content,
                Date = DateTime.Now.ToUniversalTime(),
                Language = language,
                Reason = reason,
                PreviousTerms = currentTerms,
                Admin = userEntity
            };

            var success = await repository.SubmitTerms(termsEntity);

            return success ? Result.Ok() : Result.Fail(new TermsErrors.UnknownTermsError());
        });
    }
}