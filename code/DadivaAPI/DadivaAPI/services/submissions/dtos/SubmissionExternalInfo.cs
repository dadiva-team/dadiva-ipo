using DadivaAPI.domain;
using DadivaAPI.repositories.Entities;

namespace DadivaAPI.services.submissions.dtos;

public record SubmissionExternalInfo(
    int Id,
    DateTime SubmissionDate,
    SubmissionStatus Status,
    List<AnsweredQuestion> AnsweredQuestions,
    string DonorNic,
    string DonorName,
    List<QuestionGroup> FormQuestions
);