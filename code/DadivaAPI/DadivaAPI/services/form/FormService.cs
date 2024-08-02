using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form.dtos;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using User = DadivaAPI.domain.user.User;

namespace DadivaAPI.services.form;

public class FormService(IRepository repository, DbContext context, INotificationService notificationService)
    : IFormService
{
    public async Task<Result<GetFormOutputModel>> GetForm(string nic)
    {
        return await context.WithTransaction(async () =>
        {
            var user = await repository.GetUserByNic(nic);
            if (user is null) return Result.Fail(new UserError.UnknownDonorError());
            if (user.Suspensions is not null) return Result.Fail(new UserError.SuspendedDonorError());

            var formEntity = await repository.GetForm();
            if (formEntity is null)
            {
                return Result.Fail(new FormErrors.NoFormError());
            }

            var formDomain = formEntity.ToDomain();

            return Result.Ok(new GetFormOutputModel(
                formDomain.Groups.Select(QuestionGroupModel.FromDomain).ToList(),
                formDomain.Rules.Select(RuleModel.FromDomain).ToList()
            ));
        });
    }

    public async Task<Result<SubmitFormOutputModel>> SubmitForm(Dictionary<string, IAnswer> answers, string nic,
        int formVersion)
    {
        return await context.WithTransaction(async () =>
        {
            var userEntity = await repository.GetUserByNic(nic);
            
            if (userEntity is null) return Result.Fail(new UserError.UnknownDonorError());
            if (userEntity.Suspensions is not null) return Result.Fail(new UserError.SuspendedDonorError());
            
            var submission = new Submission(answers.Select(a => new AnsweredQuestion(a.Key, a.Value)).ToList(),
                DateTime.Now.ToUniversalTime(), nic, formVersion); 
            
            var submissionEntity = new SubmissionEntity(
                
                );
            bool isSubmitted = await repository.SubmitForm(submission.ToEntity());
            
        });


        var userAccountStatus = await repository.GetUserAccountStatus(nic);
        if (userAccountStatus != null && userAccountStatus.Status != AccountStatus.Active)
        {
            return Result<SubmitFormOutputModel, Problem>.Failure(
                new Problem(
                    "errorSubmitingForm.com",
                    "Error submitting form",
                    400,
                    "An error ocurred while submitting form"
                ));
        }

        var submission = new Submission(answers.Select(a => new AnsweredQuestion(a.Key, a.Value)).ToList(),
            DateTime.Now.ToUniversalTime(), nic, formVersion);
        bool isSubmitted = await repository.SubmitForm(submission);
        if (isSubmitted)
        {
            if (userAccountStatus != null)
            {
                userAccountStatus.Status = AccountStatus.PendingReview;
                userAccountStatus.LastSubmissionDate = submission.SubmissionDate;
                userAccountStatus.LastSubmissionId = submission.Id;
                await repository.UpdateUserAccountStatus(userAccountStatus);
            }

            return Result<SubmitFormOutputModel, Problem>.Success(new SubmitFormOutputModel(
                submission.SubmissionDate, submission.Id));
        }

        return Result<SubmitFormOutputModel, Problem>.Failure(
            new Problem(
                "errorSubmitingForm.com",
                "Error submitting form",
                400,
                "An error ocurred while submitting form"
            ));
    }

    public async Task<Result<Submission, Problem>> GetSubmission(int id)
    {
        UserEntity? user =
            Submission ? submission = await repository.GetSubmission(id);
        if (submission == null)
            return Result<Submission, Problem>.Failure(
                new Problem(
                    "errorGettingSubmission.com",
                    "Error getting submission",
                    404,
                    "An error occurred while getting submission") //TODO Create Problems types for form
            );
        return Result<Submission, Problem>.Success(submission);
    }

    public async Task<Result<bool, Problem>> LockSubmission(int submissionId, int doctorId)
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

    public async Task<Result<Review, Problem>> ReviewForm(int submissionId, int doctorNic, string status,
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
    }

    public async Task<Result<List<SubmissionModelWithLockInfo>, Problem>> GetPendingSubmissions()
    {
        var pendingSubmissions = await repository.GetPendingSubmissions();
        if (pendingSubmissions == null || !pendingSubmissions.Any())
            return Result<List<SubmissionModelWithLockInfo>, Problem>.Failure(
                new Problem(
                    "noPendingSubmissions.com",
                    "No pending submissions",
                    404,
                    "De momento não há submissões pendentes")
            );

        var pendingSubmissionsWithLockInfo = pendingSubmissions.Select(dto =>
        {
            var outputModel = ConvertToOutputModel(dto);
            return outputModel;
        }).ToList();

        return Result<List<SubmissionModelWithLockInfo>, Problem>.Success(pendingSubmissionsWithLockInfo);
    }

    public async Task<Result<SubmissionModelWithLockInfo?, Problem>> GetPendingSubmissionsByUserNic(int userNic)
    {
        var pendingSubmission = await repository.GetLatestPendingSubmissionByUser(userNic);

        if (pendingSubmission == null)
            return Result<SubmissionModelWithLockInfo?, Problem>.Failure(
                new Problem(
                    "noPendingSubmission.com",
                    "No pending submission",
                    404,
                    "The user has no pending submissions")
            );


        return Result<SubmissionModelWithLockInfo?, Problem>.Success(ConvertToOutputModel(pendingSubmission));
    }

    private SubmissionHistoryModel ConvertToOutputModel(SubmissionHistoryDto dto)
    {
        return new SubmissionHistoryModel
        {
            SubmissionId = dto.SubmissionId,
            SubmissionDate = dto.SubmissionDate,
            ByUserNic = dto.ByUserNic,
            Answers = dto.Answers.Select(AnsweredQuestionModel.FromDomain).ToList(),
            FinalNote = dto.FinalNote,
            FormVersion = dto.FormVersion,
            Notes = dto.Notes,
            ReviewDate = dto.ReviewDate,
            ReviewStatus = dto.ReviewStatus,
            DoctorNic = dto.DoctorNic
        };
    }

    private SubmissionModelWithLockInfo ConvertToOutputModel(SubmissionPendingDto dto)
    {
        return new SubmissionModelWithLockInfo(
            new SubmissionModel(
                dto.Id, dto.ByUserNic, dto.Answers.Select(AnsweredQuestionModel.FromDomain).ToList(),
                dto.SubmissionDate.ToShortDateString(), dto.FormVersion
            ), dto.LockedByDoctorNic);
    }

    public async Task<Result<SubmissionHistoryOutputModel, Problem>> GetSubmissionHistoryByNic(int nic, int limit,
        int skip)
    {
        var (submissionHistoryDtos, hasMoreSubmissions) = await repository.GetSubmissionHistoryByNic(nic, limit, skip);

        if (submissionHistoryDtos == null || !submissionHistoryDtos.Any())
        {
            return Result<SubmissionHistoryOutputModel, Problem>.Failure(
                new Problem(
                    "noSubmissionHistory.com",
                    "No submission history",
                    404,
                    "The user has no submission history")
            );
        }

        var submissionHistoryModels = submissionHistoryDtos.Select(dto =>
        {
            var outputModel = ConvertToOutputModel(dto);
            return outputModel;
        }).ToList();

        return Result<SubmissionHistoryOutputModel, Problem>.Success(
            new SubmissionHistoryOutputModel
            {
                SubmissionHistory = submissionHistoryModels,
                HasMoreSubmissions = hasMoreSubmissions
            });
    }

    public async Task<Result<Inconsistencies, Problem>> GetInconsistencies()
    {
        Inconsistencies? inconsistencies = await repository.GetInconsistencies();
        if (inconsistencies == null)
            inconsistencies = new Inconsistencies(new List<Rule>());
        return Result<Inconsistencies, Problem>.Success(inconsistencies);
    }

    public async Task<Result<bool, Problem>> EditInconsistencies(Inconsistencies inconsistencies)
    {
        return Result<bool, Problem>.Success(await repository.EditInconsistencies(inconsistencies));
    }
}