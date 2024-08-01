using DadivaAPI.domain;
using DadivaAPI.domain.user;
using DadivaAPI.services.users.dtos;
using FluentResults;

namespace DadivaAPI.services.users;

public interface IUsersService
{
    public Task<Result<string>> CreateToken(string nic, string password);

    public Task<Result<UserExternalInfo>> CreateUser(
        string nic,
        string name,
        string password,
        List<string> roles,
        bool? isVerified,
        DateTime? dateOfBirth,
        string? placeOfBirth
    );

    public Task<Result<List<UserExternalInfo>>> GetUsers(string token);

    public Task<Result> DeleteUser(string nic);

    public Task<Result<UserWithNameExternalInfo>> CheckNicExistence(string nic);

    public Task<Result> AddSuspension(UserSuspensionRequest suspensionRequest);

    public Task<Result> UpdateSuspension(Suspension suspension);

    public Task<Result<Suspension>> GetSuspension(string userNic);

    public Task<Result> DeleteSuspension(string userNic);
}