using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;
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

    public SubmissionHistoryFromReviewExternalInfo ToSubmissionHistoryExternalInfo()
    {
        return new SubmissionHistoryFromReviewExternalInfo(
            Id, Submission.ToSubmissionExternalInfo(), Doctor.Nic, Doctor.Name, Status, FinalNote, ReviewDate);
    }
}