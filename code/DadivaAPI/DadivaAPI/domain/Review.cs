using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.submissions.dtos;

namespace DadivaAPI.domain;

public record Review(
    Submission Submission,
    User Doctor,
    ReviewStatus Status,
    string? FinalNote,
    DateTime ReviewDate
)
{
    int Id { get; init; }

    public ReviewEntity ToEntity(SubmissionEntity submission)
    {
        return new ReviewEntity
        {
            Id = Id,
            Submission = submission,
            Doctor = Doctor.ToEntity(),
            Status = Status,
            FinalNote = FinalNote,
            Date = ReviewDate
        };
    }

    public ReviewHistoryFromReviewExternalInfo ToSubmissionHistoryExternalInfo(List<RuleModel>? inconsistencies)
    {
        return new ReviewHistoryFromReviewExternalInfo(
            Id, Submission.ToExternalInfo(inconsistencies), Doctor.ToUserWithNameExternalInfo(), Status, FinalNote, ReviewDate);
    }

    public static Review CreateMinimalReviewDomain(MinimalReviewDto minimalReviewDto)
    {
        var submission = Submission.CreateMinimalSubmissionDomain(minimalReviewDto.Submission);
        var donorUser = User.CreateMinimalUser(minimalReviewDto.Doctor);

        return new Review(submission, donorUser, minimalReviewDto.Status, minimalReviewDto.FinalNote,
            minimalReviewDto.Date);
    }
}