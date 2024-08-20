using DadivaAPI.domain;
using DadivaAPI.domain.user;
using DadivaAPI.repositories;
using DadivaAPI.routes.users.models;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using DomainToFromEntityExtensions = DadivaAPI.domain.DomainToFromEntityExtensions;

namespace DadivaAPI.services.users;

public class UsersService(IConfiguration config, IRepository repository, DadivaDbContext context) : IUsersService
{
    private readonly string _jwtKey = config["Jwt:Key"] ?? throw new ArgumentNullException("Jwt key is missing");

    private readonly string _jwtIssuer =
        config["Jwt:Issuer"] ?? throw new ArgumentNullException("Jwt issuer is missing");

    private readonly string _jwtAudience =
        config["Jwt:Audience"] ?? throw new ArgumentNullException("Jwt audience is missing");

    public async Task<Result<UserLoginExternalInfo>> CreateToken(string nic, string password)
    {
        return await context.WithTransaction(async () =>
        {
            var user = (await repository.GetUserByNic(nic))?.ToDomain();

            if (user == null || !user.VerifyPassword(password))
            {
                return Result.Fail(new UserError.TokenCreationError());
            }

            var newUser = user with { Token = user.GenerateToken(_jwtKey, _jwtIssuer, _jwtAudience) };

            var newUserEntity = DomainToFromEntityExtensions.ToEntity(newUser);

            var success = await repository.UpdateUser(newUserEntity);

            if (!success) return Result.Fail(new UserError.TokenCreationError());

            // Podiamos usar a função getUserByNic e incluir a suspensão tbm
            var suspension = (await repository.GetSuspensionIfActive(nic));
            var suspensiond = suspension?.ToDomain();

            var ulei = UserLoginExternalInfo.CreateUserLoginExternalInfo(nic, newUser.Token, suspensiond);

            return Result.Ok(ulei);
        });
    }


    public async Task<Result<UserExternalInfo>> CreateUser(
        string nic,
        string name,
        string password,
        List<string> roles,
        bool? isVerified,
        DateTime? dateOfBirth,
        string? placeOfBirth)
    {
        return await context.WithTransaction(async () =>
        {
            if (!User.IsValidNic(nic))
                return Result.Fail(new UserError.TokenCreationError()); //TODO: Invalid Nic Error


            if (!User.IsValidPassword(password))
                return Result.Fail(new UserError.TokenCreationError()); //TODO: Invalid Password Error


            List<Role> parsedRoles = [];
            foreach (var role in roles)
            {
                if (!Enum.TryParse<Role>(role, out var parsedRole))
                {
                    return Result.Fail(new UserError.TokenCreationError()); //TODO: Bad Role Error
                }

                parsedRoles.Add(parsedRole);
            }

            var user = new User(nic, name, User.HashPassword(password), parsedRoles, null, isVerified, dateOfBirth,
                placeOfBirth);

            var success = await repository.UpdateUser(user.ToEntity());

            return !success
                ? Result.Fail(new UserError.UnknownError())
                : Result.Ok(new UserExternalInfo(nic));
        });
    }

    public async Task<Result<List<UserExternalInfo>>> GetUsers()
    {
        return await context.WithTransaction(async () =>
        {
            var users = (await repository.GetUsers()).Select(user => user.ToDomain())
                .ToList();
            return Result.Ok(users.Select(user => new UserExternalInfo(user.Nic)).ToList());
        });
    }

    public async Task<Result> DeleteUser(string nic)
    {
        return await context.WithTransaction(async () =>
        {
            var success = await repository.DeleteUser(nic);
            return !success
                ? Result.Fail(new UserError.TokenCreationError())
                : //TODO: Custom error
                Result.Ok();
        });
    }

    public async Task<Result<UserWithNameExternalInfo>> CheckNicExistence(string nic)
    {
        return await context.WithTransaction(async () =>
        {
            var user = await repository.GetUserByNic(nic);
            return user == null
                ? Result.Fail(new UserError.TokenCreationError()) //TODO: Custom Error
                : Result.Ok(new UserWithNameExternalInfo(user.Name, user.Nic));
        });
    }

    public async Task<Result> AddSuspension(
        string donorNic,
        string doctorNic,
        string type,
        string startDate,
        string? endDate,
        string? reason,
        string? note
    )
    {
        return await context.WithTransaction(async () =>
        {
            var suspendedUser = (await repository.GetUserByNic(donorNic))?.ToDomain();
            var doctorUser = (await repository.GetUserByNic(doctorNic))?.ToDomain();

            if (suspendedUser == null)
                return Result.Fail(new UserError.UnknownDonorError());

            if (doctorUser == null)
                return Result.Fail(new UserError.UnknownDoctorError());

            DateTime? suspensionEndDate = null;
            var suspensionStartDate = DateTime.Parse(startDate).ToUniversalTime();
            if (endDate != null)
            {
                suspensionEndDate = DateTime.Parse(endDate).ToUniversalTime();
            }

            if (!Enum.TryParse<SuspensionType>(type, out var parsedType))
            {
                return Result.Fail(new UserError.InvalidSuspensionTypeError());
            }

            var suspension = new Suspension(suspendedUser, doctorUser, suspensionStartDate,
                parsedType, true, note, reason, suspensionEndDate);

            bool success = await repository.AddSuspension(suspension.ToEntity());
            return !success
                ? Result.Fail(new UserError.UnknownError())
                : Result.Ok();
        });
    }

    public async Task<Result> UpdateSuspension(
        string donorNic,
        string doctorNic,
        string startDate,
        string type,
        string? endDate,
        string? note,
        string? reason
    )
    {
        return await context.WithTransaction(async () =>
        {
            var suspensionEntity = await repository.GetSuspension(donorNic);
            if (suspensionEntity is null)
            {
                return Result.Fail(new UserError.UserHasNoSuspensionError());
            }


            suspensionEntity.StartDate = DateTime.Parse(startDate).ToUniversalTime();
            suspensionEntity.Type = type;

            if (endDate is not null && type != "permanent") //TODO: wtf is this, if endDate is null it always fails
            {
                suspensionEntity.EndDate = DateTime.Parse(endDate).ToUniversalTime();
            }
            else
            {
                return Result.Fail(new UserError.InvalidEndDateTypeError());
            }

            var doctorEntity = await repository.GetUserByNic(doctorNic);

            if (doctorEntity is null)
            {
                return Result.Fail(new UserError.UnknownDoctorError());
            }

            suspensionEntity.Doctor = doctorEntity;
            suspensionEntity.Note = note;
            suspensionEntity.Reason = reason;
            suspensionEntity.IsActive = (DateTime.Parse(endDate) > DateTime.UtcNow);

            var success = await repository.UpdateSuspension(suspensionEntity);
            return !success
                ? Result.Fail(new UserError.UnknownError())
                : Result.Ok();
        });
    }

    public async Task<Result<SuspensionWithNamesExternalInfo>> GetSuspension(string userNic)
    {
        return await context.WithTransaction(async () =>
        {
            var suspensionEntity = await repository.GetSuspension(userNic);
            if (suspensionEntity is null)
            {
                return Result.Fail(new UserError.TokenCreationError()); //TODO: Custom Error
            }

            return Result.Ok(new SuspensionWithNamesExternalInfo(
                suspensionEntity.Donor.Nic,
                suspensionEntity.Donor.Name,
                suspensionEntity.Doctor.Nic,
                suspensionEntity.Doctor.Name,
                suspensionEntity.Type,
                suspensionEntity.StartDate.ToString(),
                suspensionEntity.EndDate?.ToString(),
                suspensionEntity.Reason,
                suspensionEntity.Note
            ));
        });
    }

    public async Task<Result> DeleteSuspension(string userNic)
    {
        return await context.WithTransaction(async () =>
        {
            var success = await repository.DeleteSuspension(userNic);
            return !success
                ? Result.Fail(new UserError.TokenCreationError()) //TODO: Custom Error
                : Result.Ok();
        });
    }
}