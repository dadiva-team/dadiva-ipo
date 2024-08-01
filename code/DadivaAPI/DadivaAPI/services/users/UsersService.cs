using DadivaAPI.domain;
using DadivaAPI.domain.user;
using DadivaAPI.repositories;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using DomainToFromEntityExtensions = DadivaAPI.domain.DomainToFromEntityExtensions;

namespace DadivaAPI.services.users;

public class UsersService(IConfiguration config, IRepository repository, DbContext context) : IUsersService
{
    private readonly string _jwtKey = config["Jwt:Key"] ?? throw new ArgumentNullException("Jwt key is missing");

    private readonly string _jwtIssuer =
        config["Jwt:Issuer"] ?? throw new ArgumentNullException("Jwt issuer is missing");

    private readonly string _jwtAudience =
        config["Jwt:Audience"] ?? throw new ArgumentNullException("Jwt audience is missing");

    public async Task<Result<string>> CreateToken(string nic, string password)
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

            if (!success) Result.Fail(new UserError.TokenCreationError());

            return Result.Ok(newUser.Token);
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
                ? Result.Fail(new UserError.TokenCreationError()) //TODO: Unknown Error
                : Result.Ok(new UserExternalInfo(nic));
        });
    }

    public async Task<Result<List<UserExternalInfo>>> GetUsers(string token)
    {
        //TODO add check user authentication, can users be null(beyond an error case)?
        // idk know what this to do is
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

    public async Task<Result> AddSuspension(UserSuspensionRequest suspensionRequest)
    {
        return await context.WithTransaction(async () =>
        {
            var suspendedUser = (await repository.GetUserByNic(suspensionRequest.UserNic))?.ToDomain();
            var doctorUser = (await repository.GetUserByNic(suspensionRequest.SuspendedBy))?.ToDomain();

            if (suspendedUser == null)
                return Result.Fail(new UserError.TokenCreationError()); //TODO: Custom Error

            if (doctorUser == null)
                return Result.Fail(new UserError.TokenCreationError()); //TODO: Custom Error

            DateTime? suspensionEndDate = null;
            var suspensionStartDate = DateTime.Parse(suspensionRequest.SuspensionStartDate).ToUniversalTime();
            if (suspensionRequest.SuspensionEndDate != null)
            {
                suspensionEndDate = DateTime.Parse(suspensionRequest.SuspensionEndDate).ToUniversalTime();
            }

            var suspension = new Suspension(suspendedUser, doctorUser, suspensionStartDate,
                suspensionRequest.SuspensionType,
                suspensionRequest.SuspensionNote, suspensionRequest.Reason, suspensionEndDate);

            bool success = await repository.AddSuspension(suspension.ToEntity());
            return !success
                ? Result.Fail(new UserError.TokenCreationError()) //TODO: Custom Error
                : Result.Ok();
        });
    }

    public async Task<Result> UpdateSuspension(Suspension suspension)
    {
        return await context.WithTransaction(async () =>
        {
            var success = await repository.UpdateSuspension(suspension.ToEntity());
            return !success
                ? Result.Fail(new UserError.TokenCreationError()) //TODO: Custom Error
                : Result.Ok();
        });
    }

    public async Task<Result<Suspension>> GetSuspension(string userNic)
    {
        return await context.WithTransaction(async () =>
        {
            var suspension = await repository.GetSuspension(userNic);
            return suspension == null
                ? Result.Fail(new UserError.TokenCreationError()) //TODO: Custom Error
                : Result.Ok(suspension.ToDomain());
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