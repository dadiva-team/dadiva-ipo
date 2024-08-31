using DadivaAPI.repositories.Entities;

namespace DadivaAPI.services.submissions.dtos;

public record SubmissionHistoryFromReviewExternalInfo(
    int Id,
    SubmissionExternalInfo Submission,
    string DoctorNic,
    string DoctorName,
    ReviewStatus Status,
    string? FinalNote,
    DateTime ReviewDate
);