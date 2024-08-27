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
            Doctor = domain.Doctor?.ToEntity(),
            Note = domain.Note,
            Reason = domain.Reason,
            StartDate = domain.StartDate,
            IsActive = domain.IsActive,
            EndDate = domain.EndDate,
            Type = domain.Type.ToString()
        };
    }

    public static Suspension ToDomain(this SuspensionEntity domain)
    {
        return new Suspension(domain.Donor.ToDomain(), domain.Doctor.ToDomain(), domain.StartDate,
            Enum.Parse<SuspensionType>(domain.Type), domain.IsActive, domain.Note, domain.Reason, domain.EndDate, domain.Id);
    }


    public static LockEntity ToEntity(Lock domain)
    {
        return new LockEntity
        {
            LockEntityId = domain.EntityId,
            LockEntityType = domain.LockEntityType,
            Doctor = domain.Doctor.ToEntity(),
            LockDate = domain.LockDate
        };
    }

    public static Submission ToDomain(this SubmissionEntity entity)
    {
        return new Submission(entity.AnsweredQuestions.Select(aq => aq.ToDomain()).ToList(), entity.Date, entity.Status, entity.Language,
            entity.Donor.ToDomain(), entity.Form.ToDomain(), entity.LockedBy?.ToDomain());
    }

    public static Review ToDomain(this ReviewEntity entity)
    {
        return new Review(entity.Submission.ToDomain(), entity.Doctor.ToDomain(), entity.Status,
            entity.FinalNote, entity.Date);
    }

    public static ManualEntry ToDomain(this ManualEntryEntity entity)
    {
        return new ManualEntry(entity.Name, entity.EntryExamples.Select(e => e.ToDomain()).ToList());
    }

    public static EntryExample ToDomain(this EntryExampleEntity entity)
    {
        return new EntryExample(entity.Text, entity.Criterias.Select(c => c.ToDomain()).ToList());
    }

    public static Criteria ToDomain(this CriteriaEntity entity)
    {
        return new Criteria(entity.Text);
    }
}