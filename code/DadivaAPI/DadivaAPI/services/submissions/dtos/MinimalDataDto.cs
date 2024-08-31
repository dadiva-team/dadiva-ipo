using DadivaAPI.repositories.Entities;

namespace DadivaAPI.services.submissions.dtos;

public record MinimalUserDto(string Nic, string Name);
public record MinimalFormDto(int Id);
public record MinimalSubmissionDto(
    int Id,
    SubmissionStatus Status,
    LockEntity? LockedBy,
    List<AnsweredQuestionEntity> AnsweredQuestions,
    MinimalUserDto Donor,
    MinimalFormDto Form
);
