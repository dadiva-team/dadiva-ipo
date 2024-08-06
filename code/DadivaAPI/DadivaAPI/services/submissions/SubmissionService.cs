using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form.dtos;
using DadivaAPI.services.submissions;
using DadivaAPI.services.submissions.dtos;
using DadivaAPI.utils;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.services.form;

public class SubmissionService(IRepository repository, DbContext context, INotificationService notificationService)
    : ISubmissionService
{
    /*public async Task<Result<bool, Problem>> LockSubmission(int submissionId, int doctorId)
    {
        bool isLocked = await repository.LockSubmission(submissionId, doctorId);
        if (!isLocked)
        {
            return Result<bool, Problem>.Failure(
                new Problem("lockSubmissionError", "Unable to lock submission", 400, "Unable to lock submission")
            );
        }

        await notificationService.NotifyAllAsync(JsonSerializer.Serialize(new { type = "lock", submissionId }));
        return Result<bool, Problem>.Success(true);
    }

    public async Task<Result<bool, Problem>> UnlockSubmission(int submissionId, int doctorId)
    {
        bool isUnlocked = await repository.UnlockSubmission(submissionId, doctorId);
        if (!isUnlocked)
        {
            return Result<bool, Problem>.Failure(
                new Problem("unlockSubmissionError", "Unable to unlock submission", 400, "Unable to unlock submission")
            );
        }

        await notificationService.NotifyAllAsync(JsonSerializer.Serialize(new { type = "unlock", submissionId }));
        return Result<bool, Problem>.Success(true);
    }

    public async Task UnlockExpiredSubmissions(TimeSpan lockTimeout)
    {
        var expiredLocks = await repository.GetExpiredLocks(lockTimeout);
        foreach (var expiredLock in expiredLocks)
        {
            await repository.UnlockSubmission(expiredLock.SubmissionId, expiredLock.LockedByDoctorNic);
            var message = JsonSerializer.Serialize(new
                { type = "unlock", submissionId = expiredLock.SubmissionId, reason = "timeout" });
            await notificationService.NotifyAllAsync(message);
        }
    }

    /*public async Task<Result<Review, Problem>> ReviewForm(int submissionId, int doctorNic, string status,
        string? finalNote, List<NoteModel>? noteModels = null)
    {
        Submission? submission = await repository.GetSubmissionById(submissionId);
        if (submission == null)
            return Result<Review, Problem>.Failure(
                new Problem(
                    "errorGettingSubmission.com",
                    "Error getting submission",
                    404,
                    "An error occurred while getting submission") //TODO Create Problems types for form
            );

        var review = new Review(
            submissionId,
            doctorNic,
            status,
            finalNote,
            DateTime.UtcNow
        );

        var addedReview = await repository.AddReview(review);

        if (noteModels != null && noteModels.Any())
        {
            foreach (var note in noteModels)
            {
                var newNote = new Note(
                    addedReview.Id,
                    note.QuestionId,
                    note.NoteText
                );

                await repository.AddNote(newNote);
            }
        }

        // Unlock user account
        var userAccountStatus = await repository.GetUserAccountStatus(submission.Donor);
        if (userAccountStatus != null)
        {
            userAccountStatus.Status = AccountStatus.Active;
            await repository.UpdateUserAccountStatus(userAccountStatus);
        }

        // Remove lock
        await repository.UnlockSubmission(submissionId, doctorNic);

        // Sending notification to all doctors using the /pendingSubmission page that they can delete this submission from the list
        await notificationService.NotifyAllAsync(JsonSerializer.Serialize(new { type = "review", submissionId }));


        return Result<Review, Problem>.Success(addedReview);
    }*/

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

    public async Task<Result<SubmissionWithLockExternalInfo>> GetPendingSubmissionsByUserNic(string userNic)
    {
        return await context.WithTransaction(async () =>
        {
            var submission = await repository.GetLatestPendingSubmissionByUser(userNic);

            if (submission == null)
                return Result.Fail(new SubmissionError.NoPendingSubmissionsError());

            return Result.Ok(submission.ToDomain().ToExternalInfo());
        });
    }

    public async Task<Result<SubmissionHistoryOutputModel>> GetSubmissionHistoryByNic(string nic, int limit,
        int skip)
    {
        return await context.WithTransaction(async () =>
        {
            var (submissions, hasMoreSubmissions) = await repository.GetSubmissionHistoryByUser(nic, limit, skip);

            if (submissions == null || !submissions.Any())
                return Result.Fail(new SubmissionError.NoSubmissionsHistoryError());

            return Result.Ok(new SubmissionHistoryOutputModel(
                
                hasMoreSubmissions
            ));
        });
    }
}