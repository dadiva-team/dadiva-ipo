using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.domain.user;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form;
using DadivaAPI.services.submissions.dtos;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using FluentResults;

namespace DadivaAPI.services.submissions;

public class SubmissionService(
    IRepository repository,
    DadivaDbContext context,
    INotificationService notificationService)
    : ISubmissionService
{
    public async Task<Result<SubmitSubmissionExternalInfo>> SubmitSubmission(string donorNic, string language,
        List<AnsweredQuestionModel> answeredQuestions)
    {
        return await context.WithTransaction(async () =>
        {
            var donor = await repository.GetUserByNic(donorNic);
            if (donor is null)
                return Result.Fail(new UserError.UnknownDonorError());
            if (donor.Suspensions?.FindLast(s => s.IsActive) != null)
                return Result.Fail(new UserError.SuspendedDonorError(donor.Suspensions.Last().Reason));

            if (!Enum.TryParse<SubmissionLanguages>(language, out var parsedLanguage))
                return Result.Fail(new SubmissionErrors.InvalidLanguageErrors());

            var form = await repository.GetForm(language);
            if (form is null)
                return Result.Fail(new FormErrors.NoFormError());

            var submissionDate = DateTime.UtcNow;
            var donorDomain = donor.ToDomain();

            var submission = new Submission(
                answeredQuestions.Select(aq => aq.ToDomain(aq, form)).ToList(),
                submissionDate,
                SubmissionStatus.Pending,
                parsedLanguage,
                donorDomain,
                form.ToDomain(),
                null
            );

            // Atualizar a AccountStatus do dador
            var suspension = new Suspension(donorDomain, null, submissionDate,
                SuspensionType.pendingReview, true, null, "A submissão está em revisão", null);
            var success = await repository.AddSuspension(suspension.ToEntity());
            if (!success)
                return Result.Fail(new UserError.UnknownError());
            // TODO: Fix this

            var submissionEntity = submission.ToEntity(form);
            var submitted = await repository.SubmitSubmission(submissionEntity);

            return submitted
                ? Result.Ok(new SubmitSubmissionExternalInfo(submissionDate))
                : Result.Fail(new SubmissionErrors.SubmissionNotSavedErrors());
        });
    }

    public async Task<Result<bool>> LockSubmission(int submissionId, string doctorNic)
    {
        return await context.WithTransaction(async () =>
        {
            var doctorUser = (await repository.GetUserByNic(doctorNic))?.ToDomain();
            if (doctorUser is null)
                return Result.Fail(new UserError.UnknownDoctorError());

            LockEntity? lockEntity = await repository.GetLock(submissionId);

            if (lockEntity != null)
            {
                if (lockEntity.Doctor.Nic == doctorNic) await repository.UpdatedLockedSubmission(lockEntity);
                else return Result.Fail(new SubmissionErrors.AlreadyLockedByAnotherDoctor(lockEntity.Doctor.Name));
            }
            else
            {
                Lock l = new Lock(submissionId, LockEntityType.submission, doctorUser, DateTime.UtcNow);
                bool locked = await repository.LockSubmission(DomainToFromEntityExtensions.ToEntity(l));
            }

            await notificationService.NotifyAllAsync(JsonSerializer.Serialize(new { type = "lock", submissionId }));
            return Result.Ok();
        });
    }

    public async Task<Result<bool>> UnlockSubmission(int submissionId, string doctorNic)
    {
        return await context.WithTransaction(async () =>
        {
            var doctorUser = (await repository.GetUserByNic(doctorNic))?.ToDomain();
            if (doctorUser is null)
                return Result.Fail(new UserError.UnknownDoctorError());

            LockEntity? lockEntity = await repository.GetLock(submissionId);

            if (lockEntity is null)
                return Result.Fail(new SubmissionErrors.SubmissionNotLockedErrors());

            if (lockEntity.Doctor.Nic != doctorNic)
                return Result.Fail(new SubmissionErrors.NotYourSubmissionToUnlock(lockEntity.Doctor.Name));

            var unlocked = await repository.UnlockSubmission(lockEntity);
            if (!unlocked)
                return Result.Fail(new SubmissionErrors.SubmissionNotLockedErrors());


            await notificationService.NotifyAllAsync(JsonSerializer.Serialize(new { type = "unlock", submissionId }));
            return Result.Ok();
        });
    }

    public async Task<Result<bool>> UnlockExpiredSubmissions(TimeSpan lockTimeout)
    {
        return await context.WithTransaction(async () =>
        {
            var expiredLocks = await repository.GetExpiredLocks(lockTimeout);
            if (expiredLocks.Count == 0)
                return Result.Ok(true);

            var possibleErrors = new List<string>();
            foreach (var expiredLock in expiredLocks)
            {
                var unlocked = await repository.UnlockSubmission(expiredLock);
                if (!unlocked)
                    possibleErrors.Add(expiredLock.LockEntityId.ToString());

                var message = JsonSerializer.Serialize(new
                    { type = "unlock", submissionId = expiredLock.LockEntityId, reason = "timeout" });
                await notificationService.NotifyAllAsync(message);
            }

            return possibleErrors.Any()
                ? Result.Fail(new SubmissionErrors.SubmissionNotLockedTimeoutErrors(possibleErrors))
                : Result.Ok();
        });
    }

    public async Task<Result<List<SubmissionWithLockExternalInfo>>> GetPendingSubmissions(string doctorNic)
    {
        return await context.WithTransaction(async () =>
        {
            var doctorUser = (await repository.GetUserByNic(doctorNic))?.ToDomain();
            if (doctorUser is null)
                return Result.Fail(new UserError.UnknownDoctorError());

            var pendingSubmissions = await repository.GetPendingSubmissions();
            if (pendingSubmissions == null || !pendingSubmissions.Any())
                return Result.Fail(new SubmissionErrors.NoPendingSubmissionsErrors());

            var formCache = new Dictionary<int, FormEntity>();
            var submissionResults = new List<SubmissionWithLockExternalInfo>();

            foreach (var submission in pendingSubmissions)
            {
                if (!formCache.TryGetValue(submission.Form.Id, out var form))
                {
                    form = await repository.GetFormById(submission.Form.Id);
                    if (form != null) formCache[submission.Form.Id] = form;
                }

                if (form != null)
                {
                    submission.Form = form;
                    MinimalInconsistencyDto? inconsistenciesEntity = await repository.GetInconsistencies(submission.Form.Id);

                    List<RuleModel>? inconsistencies = Inconsistencies.CreateMinimalSubmissionDomain(inconsistenciesEntity)?.InconsistencyList
                        .Select(RuleModel.FromDomain)
                        .ToList();
                    
                    submissionResults.Add(submission.ToDomain().ToExternalInfo(inconsistencies));
                }
            }

            return Result.Ok(submissionResults);
        });
    }


    public async Task<Result<SubmissionWithLockExternalInfo>> GetPendingSubmissionsByUser(string doctorNic,
        string userNic)
    {
        return await context.WithTransaction(async () =>
        {
            var doctorUser = (await repository.GetUserByNic(doctorNic))?.ToDomain();
            if (doctorUser is null)
                return Result.Fail(new UserError.UnknownDoctorError());

            var submissionDto = await repository.GetLatestPendingSubmissionByUser(userNic);
            if (submissionDto is null)
                return Result.Fail(new SubmissionErrors.SubmissionNotFoundErrors());

            var submissionDomain = Submission.CreateMinimalSubmissionDomain(submissionDto);
            var inconsistenciesDomain = await repository.GetInconsistencies(submissionDomain.Form.Id);
            List<RuleModel>? inconsistencies = Inconsistencies.CreateMinimalSubmissionDomain(inconsistenciesDomain)?.InconsistencyList
                .Select(RuleModel.FromDomain)
                .ToList();


            return Result.Ok(submissionDomain.ToExternalInfo(inconsistencies));
        });
    }

    public async Task<Result<SubmissionHistoryOutputModel>> GetSubmissionHistoryByUser(string nic, string doctorNic,
        int limit,
        int skip)
    {
        return await context.WithTransaction(async () =>
        {
            var doctorUser = (await repository.GetUserByNic(doctorNic))?.ToDomain();
            if (doctorUser is null)
                return Result.Fail(new UserError.UnknownDoctorError());

            var (reviewsDto, hasMoreSubmissions) = await repository.GetSubmissionHistoryByUser(nic, limit, skip);

            if (reviewsDto == null || !reviewsDto.Any())
                return Result.Fail(new SubmissionErrors.NoSubmissionsHistoryErrors());

            var inconsistenciesCache = new Dictionary<int, List<RuleModel>?>();
            var reviewsResults = new List<ReviewHistoryFromReviewExternalInfo>();

            foreach (var reviewDto in reviewsDto)
            {
                var reviewDomain = Review.CreateMinimalReviewDomain(reviewDto);
                List<RuleModel>? inconsistencies = null;

                if (reviewDomain.Submission?.Form?.Id != null)
                {
                    int formId = reviewDomain.Submission.Form.Id;

                    if (!inconsistenciesCache.TryGetValue(formId, out inconsistencies))
                    {
                        var inconsistenciesDomain = await repository.GetInconsistencies(formId);
                        inconsistencies = Inconsistencies
                            .CreateMinimalSubmissionDomain(inconsistenciesDomain)?
                            .InconsistencyList
                            .Select(RuleModel.FromDomain)
                            .ToList();

                        inconsistenciesCache[formId] = inconsistencies;
                    }
                }
                
                reviewsResults.Add(reviewDomain.ToSubmissionHistoryExternalInfo(inconsistencies));
            }

            return Result.Ok(
                new SubmissionHistoryOutputModel(
                    reviewsResults,
                    hasMoreSubmissions
                )
            );
        });
    }

    public async Task<Result<List<DailySubmissionStats>>> GetStats(DateTime? startDate, DateTime? endDate)
    {
        return await context.WithTransaction(async () =>
        {
            var dailyStats = await repository.GetDailyStats(startDate ?? DateTime.Now.AddDays(-7), endDate ?? DateTime.Now);
            return Result.Ok(dailyStats);
        });
    }

}