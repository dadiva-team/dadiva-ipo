using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;
using Elastic.Clients.Elasticsearch;

namespace DadivaAPI.services.users;

public class UsersService(IConfiguration config, IRepository repository) : IUsersService
{
    public async Task<Result<Token, Problem>> CreateToken(int nic, string password)
    {
        try
        {
            string hashedPassword = User.HashPassword(password);
            Console.Out.WriteLine("nic: " + nic + " password: " + password + " hashedPassword: " + hashedPassword);
            User? user = await repository.GetUserByNic(nic);
            Console.Out.WriteLine("user: " + user + " user.HashedPassword: " + user?.HashedPassword);
            if (user == null || user.HashedPassword != hashedPassword)
            {
                return Result<Token, Problem>.Failure(
                    UserServicesErrorExtensions.ToResponse(TokenCreationError.UserOrPasswordAreInvalid));
            }

            return Result<Token, Problem>.Success(new Token(config["Jwt:Key"], config["Jwt:Issuer"],
                config["Jwt:Audience"], user));
        }
        catch (Exception e)
        {
            Console.WriteLine($"Exception while creating token '{e}'");
            return Result<Token, Problem>.Failure(UserServicesErrorExtensions.ToResponse(TokenCreationError.Unknown));
        }
    }


    public async Task<Result<UserExternalInfo, Problem>> CreateUser(int nic, string name, string password, Role role)
    {
        try
        {
            if (await repository.GetUserByNic(nic) != null)
            {
                return Result<UserExternalInfo, Problem>.Failure(
                    UserServicesErrorExtensions.ToResponse(UserServiceError.UserAlreadyExists));
            }

            if (!User.IsValidPassword(password))
            {
                return
                    Result<UserExternalInfo, Problem>.Failure(
                        UserServicesErrorExtensions.ToResponse(UserServiceError.InvalidPassword));
            }

            if (!User.IsValidNic(nic))
            {
                return
                    Result<UserExternalInfo, Problem>.Failure(
                        UserServicesErrorExtensions.ToResponse(UserServiceError.InvalidNic));
            }

            string hashedPassword = User.HashPassword(password);
            if (await repository.AddUser(new User(nic, name, hashedPassword, role)))
            {
                return Result<UserExternalInfo, Problem>.Success(new UserExternalInfo(nic));
            }

            return Result<UserExternalInfo, Problem>.Failure(
                UserServicesErrorExtensions.ToResponse(UserServiceError.Unknown));
        }
        catch (Exception e)
        {
            Console.WriteLine($"Exception while creating user '{e}'");
            return
                Result<UserExternalInfo, Problem>.Failure(
                    UserServicesErrorExtensions.ToResponse(UserServiceError.Unknown));
        }
    }

    public async Task<Result<List<UserExternalInfo>, Problem>> GetUsers(string token)
    {
        //TODO add check user authentication, can users be null(beyond an error case)?
        try
        {
            List<User>? users = await repository.GetUsers();
            if (users != null)
                return Result<List<UserExternalInfo>, Problem>.Success(
                    users.Select(user => new UserExternalInfo(user.Nic)).ToList());

            return Result<List<UserExternalInfo>, Problem>.Failure(
                UserServicesErrorExtensions.ToResponse(UserServiceError.Unknown));
        }
        catch (Exception e)
        {
            Console.WriteLine($"Exception while getting all users '{e}'");
            return
                Result<List<UserExternalInfo>, Problem>.Failure(
                    UserServicesErrorExtensions.ToResponse(UserServiceError.Unknown));
        }
    }

    public async Task<Result<Boolean, Problem>> DeleteUser(int nic)
    {
        //TODO add check user authentication
        try
        {
            User? user = await repository.GetUserByNic(nic);
            if (user == null)
                return Result<Boolean, Problem>.Failure(
                    UserServicesErrorExtensions.ToResponse(UserServiceError.InvalidNic));
            return Result<Boolean, Problem>.Success(true);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Exception while deleting user '{e}'");
            return
                Result<Boolean, Problem>.Failure(
                    UserServicesErrorExtensions.ToResponse(UserServiceError.Unknown));
        }
    }
    
    public async Task<Result<UserAccountStatus?, Problem>> GetUserAccountStatus(int userNic)
    {
        var userStatus = await repository.GetUserAccountStatus(userNic);
        if (userStatus == null)
            return Result<UserAccountStatus?, Problem>.Failure(
                new Problem(
                    "userStatusNotFound.com",
                    "User status not found",
                    404,
                    "The user account status was not found"));

        return Result<UserAccountStatus?, Problem>.Success(userStatus);
    }

    public async Task<Result<bool, Problem>> UpdateUserAccountStatus(UserAccountStatus userAccountStatus)
    {
        bool updated = await repository.UpdateUserAccountStatus(userAccountStatus);
        if (updated)
            return Result<bool, Problem>.Success(true);
        return Result<bool, Problem>.Failure(
            new Problem(
                "errorUpdatingUserStatus.com",
                "Error updating user status",
                400,
                "An error occurred while updating the user account status"));
    }
    
    public async Task<Result<UserWithNameExternalInfo?, Problem>> CheckNicExistence(int nic)
    {
        var user = await repository.GetUserByNic(nic);
        if (user == null)
            return Result<UserWithNameExternalInfo?, Problem>.Failure(
                new Problem(
                    "userNICNotFound.com",
                    "User with that NIC not found",
                    404,
                    "The user account was not found"));
        return Result<UserWithNameExternalInfo?, Problem>.Success(new UserWithNameExternalInfo(user.Name, user.Nic));
        
    }
    
      public async Task<Result<bool, Problem>> AddSuspension(UserSuspensionRequest suspension)
    {
        try
        {
            DateTime? suspensionEndDate = null;
            DateTime suspensionStartDate = DateTime.Parse(suspension.SuspensionStartDate).ToUniversalTime();
            if (suspension.SuspensionEndDate != null)
            {
                suspensionEndDate = DateTime.Parse(suspension.SuspensionEndDate).ToUniversalTime();
            }
            var userSuspension = new UserSuspension(suspension.UserNic, suspensionStartDate, suspensionEndDate, suspension.Reason, suspension.SuspensionNote, suspension.SuspensionType, suspension.SuspendedBy);
            bool success = await repository.AddSuspension(userSuspension);
            if (success)
            {
                var userAccountStatus = await repository.GetUserAccountStatus(suspension.UserNic);
                if (userAccountStatus != null)
                {
                    userAccountStatus.Status = AccountStatus.Suspended;
                    userAccountStatus.SuspendedUntil = suspensionEndDate;
                    await repository.UpdateUserAccountStatus(userAccountStatus);
                }
                return Result<bool, Problem>.Success(true);
            }
            return Result<bool, Problem>.Failure(new Problem("addSuspensionError", "Failed to add suspension", 400, "An error occurred while adding the suspension"));
        }
        catch (Exception e)
        {
            Console.WriteLine($"Exception while adding suspension '{e}'");
            return Result<bool, Problem>.Failure(new Problem("addSuspensionException", "Exception occurred", 500, e.Message));
        }
    }

    public async Task<Result<bool, Problem>> UpdateSuspension(UserSuspension suspension)
    {
        try
        {
            bool success = await repository.UpdateSuspension(suspension);
            if (success)
            {
                var userAccountStatus = await repository.GetUserAccountStatus(suspension.UserNic);
                if (userAccountStatus != null)
                {
                    userAccountStatus.Status = AccountStatus.Suspended;
                    userAccountStatus.SuspendedUntil = suspension.SuspensionEndDate;
                    await repository.UpdateUserAccountStatus(userAccountStatus);
                }
                return Result<bool, Problem>.Success(true);
            }
            return Result<bool, Problem>.Failure(new Problem("updateSuspensionError", "Failed to update suspension", 400, "An error occurred while updating the suspension"));
        }
        catch (Exception e)
        {
            Console.WriteLine($"Exception while updating suspension '{e}'");
            return Result<bool, Problem>.Failure(new Problem("updateSuspensionException", "Exception occurred", 500, e.Message));
        }
    }

    public async Task<Result<UserSuspension?, Problem>> GetSuspension(int userNic)
    {
        try
        {
            var suspension = await repository.GetSuspension(userNic);
            if (suspension != null)
            {
                return Result<UserSuspension?, Problem>.Success(suspension);
            }
            return Result<UserSuspension?, Problem>.Failure(new Problem("suspensionNotFound", "Suspension not found", 404, "The suspension was not found"));
        }
        catch (Exception e)
        {
            Console.WriteLine($"Exception while getting suspension '{e}'");
            return Result<UserSuspension?, Problem>.Failure(new Problem("getSuspensionException", "Exception occurred", 500, e.Message));
        }
    }

    public async Task<Result<bool, Problem>> DeleteSuspension(int userNic)
    {
        try
        {
            bool success = await repository.DeleteSuspension(userNic);
            if (success)
            {
                var userAccountStatus = await repository.GetUserAccountStatus(userNic);
                if (userAccountStatus != null)
                {
                    userAccountStatus.Status = AccountStatus.Active;
                    userAccountStatus.SuspendedUntil = null;
                    await repository.UpdateUserAccountStatus(userAccountStatus);
                }
                return Result<bool, Problem>.Success(true);
            }
            return Result<bool, Problem>.Failure(new Problem("deleteSuspensionError", "Failed to delete suspension", 400, "An error occurred while deleting the suspension"));
        }
        catch (Exception e)
        {
            Console.WriteLine($"Exception while deleting suspension '{e}'");
            return Result<bool, Problem>.Failure(new Problem("deleteSuspensionException", "Exception occurred", 500, e.Message));
        }
    }
}