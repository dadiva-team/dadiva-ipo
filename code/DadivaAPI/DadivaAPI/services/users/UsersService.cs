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
    public Result<Token, string> CreateToken(int nic, string password)
    {
        string hashedPassword = $"{password}hashed";
        if (repository.CheckUserByNicAndPassword(nic, hashedPassword))
        {
            Token token = new Token(config["Jwt:Key"], config["Jwt:Issuer"]);
            return Result<Token, string>.Success(token);
        }

        return Result<Token, string>.Failure("Invalid credentials");
    }

    public Result<UserExternalInfo, string> CreateUser(int nic, string password)
    {
        string hashedPassword = $"{password}hashed";
        if (repository.AddUser(nic, hashedPassword))
        {
            return Result<UserExternalInfo, string>.Success(new UserExternalInfo(nic));
        }

        return Result<UserExternalInfo, string>.Failure("User already exists");
    }
}