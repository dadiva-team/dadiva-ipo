namespace DadivaAPI.services.submissions.dtos;

public record SubmissionStatsExternalInfo(
    int Total,
    int Approved,
    int Denied
    );