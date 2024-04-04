using DadivaAPI.domain;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;

namespace DadivaAPI.services.users;

public interface IUsersService
{
    public Result<Token, Problem> CreateToken(int nic, string password);
    
    public Result<UserExternalInfo, Problem> CreateUser(int nic, string password);
}