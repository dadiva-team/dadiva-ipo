using DadivaAPI.repositories.Entities;

namespace DadivaAPI.services.submissions.dtos;

public record MinimalUserDto(string Nic, string Name);
public record MinimalFormDto(int Id);
public record MinimalSubmissionDto(
    int Id,
    SubmissionStatus Status,
    DateTime SubmissionDate,
    LockEntity? LockedBy,
    List<AnsweredQuestionEntity> AnsweredQuestions,
    MinimalUserDto Donor,
    MinimalFormDto Form
);

public record MinimalInconsistencyDto(
    int Id,
    DateTime Date,
    string? Reason,
    List<RuleEntity> Rules,
    MinimalUserDto Admin,
    MinimalFormDto Form
);

public record MinimalReviewDto(
    int Id,
    ReviewStatus Status,
    DateTime Date,
    string? FinalNote,
    MinimalUserDto Doctor,
    MinimalSubmissionDto Submission
);
