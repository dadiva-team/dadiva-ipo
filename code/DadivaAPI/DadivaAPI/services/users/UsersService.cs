using System.IdentityModel.Tokens.Jwt;
using System.Text;
using DadivaAPI.domain;
using DadivaAPI.repositories.users;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;
using Microsoft.IdentityModel.Tokens;

namespace DadivaAPI.services.users;

public class UsersService(IConfiguration config, IUsersRepository repository) : IUsersService
{
    public Result<Token, Problem> CreateToken(int nic, string password)
    {
        string hashedPassword = $"{password}hashed";
        if (repository.CheckUserByNicAndPassword(nic, hashedPassword))
        {
            Token token = new Token(config["Jwt:Key"], config["Jwt:Issuer"]);
            return Result<Token, Problem>.Success(token);
        }
        
        return Result<Token, Problem>.Failure(UserServicesErrorExtensions.ToResponse(TokenCreationError.UserOrPasswordAreInvalid));
    }

    public Result<UserExternalInfo, Problem> CreateUser(int nic, string password)
    {
        string hashedPassword = $"{password}hashed";
        if (!User.IsValidPassword(password))
        {
            return Result<UserExternalInfo, Problem>.Failure(UserServicesErrorExtensions.ToResponse(UserServiceError.InvalidPassword));
        } 
        if (!User.IsValidNic(nic))
        {
            return Result<UserExternalInfo, Problem>.Failure(UserServicesErrorExtensions.ToResponse(UserServiceError.InvalidNic));
        } 
        if (repository.AddUser(nic, hashedPassword))
        {
            return Result<UserExternalInfo, Problem>.Success(new UserExternalInfo(nic));
        }

        return Result<UserExternalInfo, Problem>.Failure(UserServicesErrorExtensions.ToResponse(UserServiceError.UserAlreadyExists));
    }
}