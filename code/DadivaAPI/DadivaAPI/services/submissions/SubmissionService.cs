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

public class SubmissionService(IRepository repository, DadivaDbContext context, INotificationService notificationService)
    : ISubmissionService
{
    public async Task<Result<SubmitSubmissionExternalInfo>> SubmitSubmission(string donorNic,string language, List<AnsweredQuestionModel> answeredQuestions)
    {
        return await context.WithTransaction(async () =>
        {
            var donor = await repository.GetUserByNic(donorNic);
            if (donor is null)
                return Result.Fail(new UserError.UnknownDonorError());
            if(donor.Suspensions?.FindLast(s => s.IsActive) != null)
                return Result.Fail(new UserError.SuspendedDonorError(donor.Suspensions.Last().Reason));
            
            if (!Enum.TryParse<SubmissionLanguages>(language, out var parsedLanguage))
                return Result.Fail(new SubmissionError.InvalidLanguageError());

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
            /*var suspension = new Suspension(donorDomain, null, submissionDate,
                SuspensionType.pendingReview, true, null, "A submissão está em revisão", null);
            var success = await repository.AddSuspension(suspension.ToEntity());
            if (!success)
                return Result.Fail(new UserError.UnknownError());*/ 
            // TODO: Fix this

            var submissionEntity = submission.ToEntity(donor, form);
            var submitted = await repository.SubmitSubmission(submissionEntity);
            
            return submitted
                ? Result.Ok(new SubmitSubmissionExternalInfo(submissionDate))
                : Result.Fail(new SubmissionError.SubmissionNotSavedError());
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
                else return Result.Fail(new SubmissionError.AlreadyLockedByAnotherDoctor(lockEntity.Doctor.Name));
            }
            else
            {
                Lock l = new Lock(submissionId, LockEntityType.submission, doctorUser, DateTime.Now);
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
                return Result.Fail(new SubmissionError.SubmissionNotLockedError());

            if (lockEntity.Doctor.Nic != doctorNic)
                return Result.Fail(new SubmissionError.NotYourSubmissionToUnlock(lockEntity.Doctor.Name));

            var unlocked = await repository.UnlockSubmission(lockEntity);
            if (!unlocked)
                return Result.Fail(new SubmissionError.SubmissionNotLockedError());


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
                ? Result.Fail(new SubmissionError.SubmissionNotLockedTimeoutError(possibleErrors))
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
                return Result.Fail(new SubmissionError.NoPendingSubmissionsError());


            return Result.Ok(pendingSubmissions.Select(subs => subs.ToDomain().ToExternalInfo()).ToList());
        });
    }

    public async Task<Result<SubmissionWithLockExternalInfo>> GetPendingSubmissionsByUser(string doctorNic, string userNic)
    {
        return await context.WithTransaction(async () =>
        {
            var doctorUser = (await repository.GetUserByNic(doctorNic))?.ToDomain();
            if (doctorUser is null)
                return Result.Fail(new UserError.UnknownDoctorError());
            
            var submission = await repository.GetLatestPendingSubmissionByUser(userNic);

            if (submission == null)
                return Result.Fail(new SubmissionError.NoPendingSubmissionsError());

            return Result.Ok(submission.ToDomain().ToExternalInfo());
        });
    }

    public async Task<Result<SubmissionHistoryOutputModel>> GetSubmissionHistoryByUser(string nic, string doctorNic, int limit,
        int skip)
    {
        return await context.WithTransaction(async () =>
        {
            var doctorUser = (await repository.GetUserByNic(doctorNic))?.ToDomain();
            if (doctorUser is null)
                return Result.Fail(new UserError.UnknownDoctorError());
            
            var (submissions, hasMoreSubmissions) = await repository.GetSubmissionHistoryByUser(nic, limit, skip);

            if (submissions == null || !submissions.Any())
                return Result.Fail(new SubmissionError.NoSubmissionsHistoryError());

            return Result.Ok(
                new SubmissionHistoryOutputModel(submissions.Select(sub =>
                    sub.ToDomain().ToSubmissionHistoryExternalInfo()).ToList(), hasMoreSubmissions));
        });
    }

    public async Task<Result<SubmissionStatsExternalInfo>> GetStats(DateTime? startDate, DateTime? endDate)
    {
        return await context.WithTransaction(async () =>
        {
            var (total, approved, denied) = await repository.GetStats(startDate ?? DateTime.Now.AddDays(-7), endDate ?? DateTime.Now);
            return Result.Ok(new SubmissionStatsExternalInfo(total, approved, denied));
        });
    }
}