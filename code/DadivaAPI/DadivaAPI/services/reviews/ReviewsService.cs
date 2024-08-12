using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form;
using DadivaAPI.services.submissions;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.services.reviews;

public class ReviewsService(IRepository repository, DbContext context,  INotificationService notificationService) : IReviewsService
{
    public async Task<Result<bool>> ReviewSubmission(int submissionId, string doctorNic, string status,
        List<NoteModel>? notes, string? finalNote)
    {
        return await context.WithTransaction(async () =>
        {
            var doctorUser = (await repository.GetUserByNic(doctorNic))?.ToDomain();
            if (doctorUser is null)
                return Result.Fail(new UserError.UnknownDoctorError());

            var submissionEntity = await repository.GetSubmissionById(submissionId);
            if (submissionEntity is null)
                return Result.Fail(new SubmissionError.SubmissionNotFoundError());
            if (submissionEntity.Status != SubmissionStatus.Pending)
                return Result.Fail(new SubmissionError.SubmissionNotPendingStatusError());
            if (submissionEntity.LockedBy?.Doctor.Nic != doctorNic)
                return Result.Fail(new SubmissionError.AlreadyLockedByAnotherDoctor(submissionEntity.LockedBy?.Doctor.Name!));
            
            var submissionDomain = submissionEntity.ToDomain();
            
            if(submissionDomain.ValidateStatus(status))
                return Result.Fail(new SubmissionError.InvalidStatusError());
            submissionDomain = submissionDomain.UpdateStatusFromString(status);
            
            if (!submissionDomain.ValidateDoctorNotes())
                return Result.Fail(new SubmissionError.InvalidDoctorNotesError());

            if (notes != null)
                submissionDomain = submissionDomain.AddNotesToAnsweredQuestions(notes);


            var review = new Review(
                submissionDomain,
                doctorUser,
                status,
                finalNote,
                DateTime.Now
            );

            var addedReview = await repository.SubmitReview(review.ToEntity());
            if (!addedReview)
                return Result.Fail(new ReviewErrors.ReviewNotSavedError());

            submissionEntity = submissionDomain.ToEntity();
            var updatedSubmission = await repository.UpdateSubmission(submissionEntity);
            if (!updatedSubmission)
                return Result.Fail(new SubmissionError.SubmissionNotUpdatedError());

            // Unlock submission
            await repository.UnlockSubmission(submissionEntity.LockedBy!);

            // Sending notification to all doctors using the /pendingSubmission page that they can delete this submission from the list
            await notificationService.NotifyAllAsync(JsonSerializer.Serialize(new { type = "review", submissionId }));

            // Remove user suspension
            var userSuspension = await repository.DeleteSuspension(submissionEntity.Donor.Nic);
            if (!userSuspension)
                return Result.Fail(new UserError.SuspensionNotDeletedError());

            return Result.Ok();
        });
    }
}