using DadivaAPI.domain;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;

namespace DadivaAPI.services.users;

public interface IUsersService
{
    public Task<Result<Token, Problem>> CreateToken(int nic, string password);
    
    public Task<Result<UserExternalInfo, Problem>> CreateUser(int nic, string password);
}