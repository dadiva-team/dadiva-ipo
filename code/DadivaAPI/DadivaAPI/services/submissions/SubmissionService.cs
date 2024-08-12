using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form;
using DadivaAPI.services.submissions.dtos;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.services.submissions;

public class SubmissionService(IRepository repository, DadivaDbContext context, INotificationService notificationService)
    : ISubmissionService
{
    public async Task<Result<bool>> SubmitSubmission(string donorNic, string doctorNic, List<AnsweredQuestion> answeredQuestions)
    {
        return await context.WithTransaction(async () =>
        {
            var donor = await repository.GetUserByNic(donorNic);
            var doctor = await repository.GetUserByNic(doctorNic);
            
            if (donor is null)
                return Result.Fail(new UserError.UnknownDonorError());
            
            if (doctor is null)
                return Result.Fail(new UserError.UnknownDoctorError());

            var form = await repository.GetForm("en"); //TODO: Hardcoded language
            if (form is null)
                return Result.Fail(new FormErrors.NoFormError());

            var submission = new Submission(
                answeredQuestions.ToList(),
                DateTime.Now,
                SubmissionStatus.Pending,
                donor.ToDomain(),
                form.ToDomain(),
                null
            );

            var submissionEntity = submission.ToEntity(donor, doctor);
            var submitted = await repository.SubmitSubmission(submissionEntity);

            return submitted
                ? Result.Ok()
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

    public async Task<Result<List<SubmissionWithLockExternalInfo>>> GetPendingSubmissions()
    {
        return await context.WithTransaction(async () =>
        {
            var pendingSubmissions = await repository.GetPendingSubmissions();

            if (pendingSubmissions == null || !pendingSubmissions.Any())
                return Result.Fail(new SubmissionError.NoPendingSubmissionsError());


            return Result.Ok(pendingSubmissions.Select(subs => subs.ToDomain().ToExternalInfo()).ToList());
        });
    }

    public async Task<Result<SubmissionWithLockExternalInfo>> GetPendingSubmissionsByUser(string userNic)
    {
        return await context.WithTransaction(async () =>
        {
            var submission = await repository.GetLatestPendingSubmissionByUser(userNic);

            if (submission == null)
                return Result.Fail(new SubmissionError.NoPendingSubmissionsError());

            return Result.Ok(submission.ToDomain().ToExternalInfo());
        });
    }

    public async Task<Result<SubmissionHistoryOutputModel>> GetSubmissionHistoryByUser(string nic, int limit,
        int skip)
    {
        return await context.WithTransaction(async () =>
        {
            var (submissions, hasMoreSubmissions) = await repository.GetSubmissionHistoryByUser(nic, limit, skip);

            if (submissions == null || !submissions.Any())
                return Result.Fail(new SubmissionError.NoSubmissionsHistoryError());

            return Result.Ok(
                new SubmissionHistoryOutputModel(submissions.Select(sub =>
                    sub.ToDomain().ToSubmissionHistoryExternalInfo()).ToList(), hasMoreSubmissions));
        });
    }
}