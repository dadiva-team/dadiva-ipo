using DadivaAPI.domain;
using DadivaAPI.services.submissions.dtos;

namespace DadivaAPI.routes.form.models;

public record SubmissionHistoryOutputModel(List<ReviewHistoryFromReviewExternalInfo> SubmissionHistory, bool HasMoreSubmissions);