using DadivaAPI.repositories.Entities;
using DadivaAPI.services.users.dtos;

namespace DadivaAPI.services.submissions.dtos;

public record LockSubmissionExternalInfo(
    int EntityId,
    UserWithNameExternalInfo Doctor,
    DateTime LockDate
);

