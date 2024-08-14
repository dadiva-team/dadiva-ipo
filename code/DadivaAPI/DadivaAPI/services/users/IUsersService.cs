using DadivaAPI.services.users.dtos;
using FluentResults;

namespace DadivaAPI.services.users;

public interface IUsersService
{
    public Task<Result<UserLoginExternalInfo>> CreateToken(string nic, string password);

    public Task<Result<UserExternalInfo>> CreateUser(
        string nic,
        string name,
        string password,
        List<string> roles,
        bool? isVerified,
        DateTime? dateOfBirth,
        string? placeOfBirth
    );

    public Task<Result<List<UserExternalInfo>>> GetUsers();

    public Task<Result> DeleteUser(string nic);

    public Task<Result<UserWithNameExternalInfo>> CheckNicExistence(string nic);

    public Task<Result> AddSuspension(
        string donorNic,
        string doctorNic,
        string type,
        string startDate,
        string? endDate,
        string? reason,
        string? note
    );

    public Task<Result> UpdateSuspension(
        string donorNic,
        string doctorNic,
        string startDate,
        string type,
        string? endDate,
        string? note,
        string? reason
    );

    public Task<Result<SuspensionWithNamesExternalInfo>> GetSuspension(string userNic);

    public Task<Result> DeleteSuspension(string userNic);
}