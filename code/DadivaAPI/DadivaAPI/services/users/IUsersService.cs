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
}