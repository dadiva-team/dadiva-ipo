using DadivaAPI.domain;
using DadivaAPI.repositories.users;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;

namespace DadivaAPI.services.users;

public class UsersService(IConfiguration config, IUsersRepository repository) : IUsersService
{
    public async Task<Result<Token, Problem>> CreateToken(int nic, string password)
    {
        try
        {
            string hashedPassword = $"{password}hashed";

            bool isValidUser = await repository.CheckUserByNicAndPassword(nic, hashedPassword);
            if (isValidUser)
            {
                Token token = new Token(config["Jwt:Key"], config["Jwt:Issuer"]);
                return Result<Token, Problem>.Success(token);
            }

            return Result<Token, Problem>.Failure(
                UserServicesErrorExtensions.ToResponse(TokenCreationError.UserOrPasswordAreInvalid));
        }
        catch (Exception e)
        {
            Console.WriteLine($"Exception while creating token '{e}'");
            return Result<Token, Problem>.Failure(UserServicesErrorExtensions.ToResponse(TokenCreationError.Unknown));
        }
    }


    public async Task<Result<UserExternalInfo, Problem>> CreateUser(int nic, string password)
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
            
            string hashedPassword = $"{password}hashed";
            if (await repository.AddUser(new User{nic = nic, password = hashedPassword}))
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

    public async Task<Result<List<User>, Problem>> GetUsers(string token)
    {
        //TODO add check user authentication
        try
        {
            List<User>? users = await repository.GetUsers();
            if(users != null) return Result<List<User>, Problem>.Success(users);
            return Result<List<User>, Problem>.Failure(
                UserServicesErrorExtensions.ToResponse(UserServiceError.Unknown));
        }
        catch (Exception e)
        {
            Console.WriteLine($"Exception while creating user '{e}'");
            return
                Result<List<User>, Problem>.Failure(
                    UserServicesErrorExtensions.ToResponse(UserServiceError.Unknown));
        }

    }
}