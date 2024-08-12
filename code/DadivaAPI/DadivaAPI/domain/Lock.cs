using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;
using DadivaAPI.services.submissions.dtos;

namespace DadivaAPI.domain;

public record Lock(
    int EntityId,
    LockEntityType LockEntityType,
    User Doctor,
    DateTime LockDate)
{
    
    
    public LockEntity ToEntity()
    {
        return new LockEntity
        {
            LockEntityId = EntityId,
            LockEntityType = LockEntityType,
            Doctor = Doctor.ToEntity(),
            LockDate = LockDate
        };
    }
    public LockExternalInfo ToExternalInfo()
    {
        return new LockExternalInfo(EntityId, LockEntityType, Doctor.Nic, Doctor.Name, LockDate);
    }
}