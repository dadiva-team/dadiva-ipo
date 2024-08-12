namespace DadivaAPI.services.submissions.dtos;

public record SubmissionHistoryFromReviewExternalInfo(
    int Id,
    SubmissionExternalInfo Submission,
    string DoctorNic,
    string DoctorName,
    string Status,
    string? FinalNote,
    DateTime ReviewDate
);