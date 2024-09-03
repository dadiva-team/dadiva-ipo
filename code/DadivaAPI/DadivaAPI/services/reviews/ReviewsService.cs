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

namespace DadivaAPI.services.reviews;

public class ReviewsService(IRepository repository, DadivaDbContext context,  INotificationService notificationService) : IReviewsService
{
    public async Task<Result<bool>> ReviewSubmission(int submissionId, string doctorNic, bool status,
        List<NoteModel>? notes, string? finalNote)
    {
        return await context.WithTransaction(async () =>
        {
            var doctorEntity = await repository.GetUserByNic(doctorNic);
            if (doctorEntity is null)
                return Result.Fail(new UserError.UnknownDoctorError());
            
            var submissionDto = await repository.GetSubmissionById(submissionId);
            if (submissionDto is null)
                return Result.Fail(new SubmissionErrors.SubmissionNotFoundErrors());
            if (submissionDto.Status != SubmissionStatus.Pending)
                return Result.Fail(new SubmissionErrors.SubmissionNotPendingStatusErrors());
            if (submissionDto.LockedBy != null && submissionDto.LockedBy.Doctor.Nic != doctorNic)
                return Result.Fail(new SubmissionErrors.AlreadyLockedByAnotherDoctor(submissionDto.LockedBy?.Doctor.Name!));
            
            var submissionDomain = Submission.CreateMinimalSubmissionDomain(submissionDto);
            submissionDomain = submissionDomain.UpdateStatusFromBoolean(status);
            
            if (!submissionDomain.ValidateDoctorNotes())
                return Result.Fail(new SubmissionErrors.InvalidDoctorNotesErrors());

            if (notes != null)
                submissionDomain = submissionDomain.AddNotesToAnsweredQuestions(notes);

            var doctorUser = doctorEntity.ToDomain();
            var review = new Review(
                submissionDomain,
                doctorUser,
                status ? ReviewStatus.Approved : ReviewStatus.Rejected,
                finalNote,
                DateTime.UtcNow
            );
            
            var submissionEntity = submissionDomain.ToEntity();
            var reviewEntity = review.ToEntity(submissionEntity);
            var addedReview = await repository.SubmitReview(reviewEntity);
            if (!addedReview)
                return Result.Fail(new ReviewErrors.ReviewNotSavedError());

            // Unlock submission if needed
            if(submissionDto.LockedBy != null) await repository.UnlockSubmission(submissionDto.LockedBy);

            // Sending notification to all doctors using the /pendingSubmission page that they can delete this submission from the list
            await notificationService.NotifyAllAsync(JsonSerializer.Serialize(new { type = "review", submissionId }));

            // Remove user suspension
            var userSuspension = await repository.DeleteSuspension(submissionDto.Donor.Nic);
            if (!userSuspension)
                return Result.Fail(new UserError.SuspensionNotDeletedError());

            return Result.Ok();
        });
    }
}