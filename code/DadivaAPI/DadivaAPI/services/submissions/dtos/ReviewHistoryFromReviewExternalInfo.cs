using DadivaAPI.repositories.Entities;
using DadivaAPI.services.users.dtos;

namespace DadivaAPI.services.submissions.dtos;

public record ReviewHistoryFromReviewExternalInfo(
    int Id,
    SubmissionWithLockExternalInfo Submission,
    UserWithNameExternalInfo Doctor,
    ReviewStatus Status,
    string? FinalNote,
    DateTime ReviewDate
);