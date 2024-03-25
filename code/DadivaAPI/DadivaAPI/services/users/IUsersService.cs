using DadivaAPI.domain;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;

namespace DadivaAPI.services.users;

public interface IUsersService
{
    public Result<Token, string> CreateToken(int nic, string password);
    
    public Result<UserExternalInfo, string> CreateUser(int nic, string password);
}