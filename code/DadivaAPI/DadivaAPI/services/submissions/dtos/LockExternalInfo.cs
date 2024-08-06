using DadivaAPI.repositories.Entities;

namespace DadivaAPI.services.submissions.dtos;

public record LockExternalInfo(
    int Id,
    int EntityId,
    LockEntityType LockEntityType,
    string DoctorNic,
    string DoctorName,
    DateTime LockDate
);