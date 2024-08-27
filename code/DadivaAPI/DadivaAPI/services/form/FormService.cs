using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using FluentResults;

namespace DadivaAPI.services.form;

public class FormService(IRepository repository, DadivaDbContext context)
    : IFormService
{
    public async Task<Result<GetFormOutputModel>> GetForm(string language)
    {
        return await context.WithTransaction(async () =>
        {
            /*var user = await repository.GetUserByNic(nic);
            if (user is null) return Result.Fail(new UserError.UnknownDonorError());
            if (user.Suspensions is not null) return Result.Fail(new UserError.SuspendedDonorError());*/

            if (!Enum.TryParse<FormLanguages>(language, out var parsedLanguage))
                return Result.Fail(new FormErrors.InvalidLanguageError());
            
            var formEntity = await repository.GetForm(language);
            if (formEntity is null && parsedLanguage != FormLanguages.En)
            {
                formEntity = await repository.GetForm("En");
            }

            if (formEntity is null) return new FormErrors.NoFormError();

            var formDomain = formEntity.ToDomain();

            return Result.Ok(new GetFormOutputModel(
                formEntity.Language,
                formDomain.Groups.Select(QuestionGroupModel.FromDomain).ToList(),
                formDomain.Rules.Select(RuleModel.FromDomain).ToList()
            ));
        });
    }

    public async Task<Result> AddForm(
        List<QuestionGroupModel> questionGroups,
        List<RuleModel> rules,
        string language,
        string? reason,
        string nic)
    {
        return await context.WithTransaction(async () =>
        {
            var adminEntity = await repository.GetUserByNic(nic);
            if (adminEntity is null) return Result.Fail(new UserError.UnknownAdminError());

            if (!Enum.TryParse<FormLanguages>(language, out var parsedLanguage))
                return Result.Fail(new FormErrors.InvalidLanguageError());

            var formDomain = new Form(
                questionGroups.Select(qgm => QuestionGroupModel.ToDomain(qgm)).ToList(),
                rules.Select(rm => RuleModel.ToDomain(rm)).ToList(),
                parsedLanguage,
                adminEntity.ToDomain()
            );

            var formEntity = formDomain.ToEntity(
                await repository.GetForm(language),
                adminEntity,
                reason
            );

            var success = await repository.AddForm(formEntity);
            return !success ? Result.Fail(new FormErrors.UnknownError()) : Result.Ok();
        });
    }


    public async Task<Result<GetInconsistenciesOutputModel>> GetInconsistencies()
    {
        return await context.WithTransaction(async () =>
        {
            var inconsistencyEntity = await repository.GetInconsistencies();
            Console.Out.WriteLine("||||||||||||||||||||||");
            Console.Out.WriteLine("||||||||||||||||||||||");
            Console.Out.WriteLine("||||||||||||||||||||||");
            Console.Out.WriteLine("||||||||||||||||||||||");
            Console.Out.WriteLine(inconsistencyEntity);
            if (inconsistencyEntity is null)
            {
                return Result.Fail(new FormErrors.NoInconsistenciesError());
            }

            var inconsistencyDomain = inconsistencyEntity.ToDomain().InconsistencyList;

            return Result.Ok(new GetInconsistenciesOutputModel(
                inconsistencyEntity
                    .ToDomain()
                    .InconsistencyList
                    .Select(RuleModel.FromDomain)
                    .ToList()
            ));
        });
    }

    public async Task<Result> EditInconsistencies(
        List<RuleModel> inconsistencies,
        string nic,
        string language,
        string? reason
    )
    {
        return await context.WithTransaction(async () =>
        {
            var admin = await repository.GetUserByNic(nic);

            if (admin is null)
            {
                return Result.Fail(new UserError.UnknownAdminError());
            }

            if (!Enum.TryParse<FormLanguages>(language, out var parsedLanguage))
                return Result.Fail(new FormErrors.InvalidLanguageError());

            var ruleEntities = inconsistencies
                .Select(RuleModel.ToDomain)
                .Select(r => r.ToEntity())
                .ToList();

            var formEntity = await repository.GetForm(language);
            if (formEntity is null)
            {
                return Result.Fail(new FormErrors.NoFormError());
            }

            var success = await repository.SubmitInconsistencies(
                new InconsistencyEntity
                {
                    Admin = admin,
                    Date = DateTime.Now.ToUniversalTime(),
                    Form = formEntity,
                    Reason = reason,
                    Rules = ruleEntities
                }
            );

            return success ? Result.Ok() : Result.Fail(new FormErrors.UnknownError());
        });
    }
}