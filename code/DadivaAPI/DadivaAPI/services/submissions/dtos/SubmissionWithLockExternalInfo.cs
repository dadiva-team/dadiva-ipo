using DadivaAPI.domain;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.users.dtos;

namespace DadivaAPI.services.submissions.dtos;

public record SubmissionWithLockExternalInfo(
    int Id,
    DateTime SubmissionDate,
    SubmissionStatus Status,
    List<AnsweredQuestion> AnsweredQuestions,
    UserWithNameExternalInfo Donor,
    List<RuleModel>? Inconsistencies,
    LockSubmissionExternalInfo? Lock
);

