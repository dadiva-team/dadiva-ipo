using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.submissions.dtos;
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
                null,
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


    public async Task<Result<GetInconsistenciesOutputModel>> GetInconsistencies(string language)
    {
        return await context.WithTransaction(async () =>
        {
            var formEntity = await repository.GetForm(language);
            var inconsistencyDto = await repository.GetInconsistencies(formEntity?.Id);
            if (inconsistencyDto is null)
            {
                return Result.Fail(new FormErrors.NoInconsistenciesError());
            }

            Inconsistencies? inconsistencies = Inconsistencies.CreateMinimalSubmissionDomain(inconsistencyDto);

            List<RuleModel>? rules = inconsistencies?.InconsistencyList
                .Select(RuleModel.FromDomain)
                .ToList();
            List<string> reasons = inconsistencies?.Reason ?? new List<string>();

            if (rules == null || rules.Count != reasons.Count)
            {
                return Result.Fail(new FormErrors.UnknownError());
            }

            var ruleWithReasonList = rules
                .Select((rule, index) => new RuleWithReason
                {
                    Rule = rule,
                    Reason = reasons[index]
                })
                .ToList();

            return Result.Ok(new GetInconsistenciesOutputModel(ruleWithReasonList));
        });
    }

    public async Task<Result> EditInconsistencies(
        List<RuleModel> inconsistencies,
        string nic,
        string language,
        List<string>? reason
    )
    {
        return await context.WithTransaction(async () =>
        {
            var admin = await repository.GetUserByNic(nic);

            if (admin is null) return Result.Fail(new UserError.UnknownAdminError());


            if (!Enum.TryParse<FormLanguages>(language, out var parsedLanguage))
                return Result.Fail(new FormErrors.InvalidLanguageError());

            List<Rule> rules = inconsistencies.Select(rm => RuleModel.ToDomain(rm)).ToList();

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
                    Rules = rules.Select(r => r.ToEntity()).ToList()
                }
            );

            return success ? Result.Ok() : Result.Fail(new FormErrors.UnknownError());
        });
    }
}