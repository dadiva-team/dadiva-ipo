using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;

namespace DadivaAPI.domain;

public static class DomainToFromEntityExtensions
{
    public static User ToDomain(this UserEntity entity)
    {
        var roles = entity.Roles.Select(Enum.Parse<user.Role>).ToList();

        return new User(entity.Nic, entity.Name, entity.HashedPassword, roles, entity.Token, entity.IsVerified,
            entity.DateOfBirth, entity.PlaceOfBirth);
    }

    public static UserEntity ToEntity(this User domain)
    {
        return new UserEntity
        {
            Nic = domain.Nic,
            Name = domain.Name,
            HashedPassword = domain.HashedPassword,
            Roles = domain.Roles.Select(r => r.ToString()).ToList(),
            Token = domain.Token,
            IsVerified = domain.IsVerified,
            PlaceOfBirth = domain.PlaceOfBirth,
            DateOfBirth = domain.DateOfBirth
        };
    }

    public static SuspensionEntity ToEntity(this Suspension domain)
    {
        return new SuspensionEntity
        {
            Donor = domain.Donor.ToEntity(),
            Doctor = domain.Doctor.ToEntity(),
            Note = domain.Note,
            Reason = domain.Reason,
            StartDate = domain.StartDate,
            EndDate = domain.EndDate,
            Type = domain.Type.ToString()
        };
    }

    public static Suspension ToDomain(this SuspensionEntity domain)
    {
        return new Suspension(domain.Donor.ToDomain(), domain.Doctor.ToDomain(), domain.StartDate,
            Enum.Parse<SuspensionType>(domain.Type), domain.Note, domain.Reason, domain.EndDate, domain.Id);
    }


    public static LockEntity ToEntity(Lock domain)
    {
        return new LockEntity
        {
            Id = domain.Id,
            EntityId = domain.EntityId,
            LockEntityType = domain.LockEntityType,
            Doctor = domain.Doctor.ToEntity(),
            LockDate = domain.LockDate
        };
    }

    public static Submission ToDomain(this SubmissionEntity entity)
    {
        return new Submission(
            entity.Id, entity.AnsweredQuestions.Select(aq => aq.ToDomain()).ToList(), entity.Date, entity.Status, 
            entity.Donor.ToDomain(), entity.Form.ToDomain(), entity.LockedBy.ToDomain());
    }
}