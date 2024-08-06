using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;
using DadivaAPI.services.submissions.dtos;

namespace DadivaAPI.domain;

public record Lock(
    int Id,
    int EntityId,
    LockEntityType LockEntityType,
    User Doctor,
    DateTime LockDate)
{
    public LockExternalInfo ToExternalInfo()
    {
        return new LockExternalInfo(Id, EntityId, LockEntityType, Doctor.Nic, Doctor.Name, LockDate);
    }
}