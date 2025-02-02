using DadivaAPI.repositories.Entities;
using DadivaAPI.services.users.dtos;

namespace DadivaAPI.services.submissions.dtos;

public record LockExternalInfo(
    int EntityId,
    LockEntityType LockEntityType,
    string DoctorNic,
    string DoctorName,
    DateTime LockDate
);