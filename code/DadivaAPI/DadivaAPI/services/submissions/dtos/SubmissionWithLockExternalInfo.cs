using DadivaAPI.domain;
using DadivaAPI.repositories.Entities;

namespace DadivaAPI.services.submissions.dtos;

public record SubmissionWithLockExternalInfo(
    int Id,
    DateTime SubmissionDate,
    SubmissionStatus Status,
    string DonorNic,
    string DonorName,
    int FormId,
    LockExternalInfo Lock
);