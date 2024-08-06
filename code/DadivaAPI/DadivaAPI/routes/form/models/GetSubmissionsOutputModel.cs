using DadivaAPI.domain;
using DadivaAPI.repositories.Entities;
using DadivaAPI.services.submissions.dtos;

namespace DadivaAPI.routes.form.models;

public record GetSubmissionsOutputModel(List<SubmissionWithLockExternalInfo> Submissions);