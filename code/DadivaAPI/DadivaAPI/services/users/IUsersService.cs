using DadivaAPI.domain;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;
using Elastic.Clients.Elasticsearch;

namespace DadivaAPI.services.users;

public interface IUsersService
{
    public Task<Result<Token, Problem>> CreateToken(int nic, string password);

    public Task<Result<UserExternalInfo, Problem>> CreateUser(int nic, string name, string password, Role role);

    public Task<Result<List<UserExternalInfo>, Problem>> GetUsers(string token);

    public Task<Result<Boolean, Problem>> DeleteUser(int nic);
    
    public Task<Result<UserAccountStatus?, Problem>> GetUserAccountStatus(int userNic);
    
    public Task<Result<Boolean, Problem>> UpdateUserAccountStatus(UserAccountStatus userAccountStatus);

    public Task<Result<UserWithNameExternalInfo?, Problem>> CheckNicExistence(int nic);
}