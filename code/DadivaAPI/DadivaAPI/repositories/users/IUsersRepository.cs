using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;

namespace DadivaAPI.repositories.users;

public interface IUsersRepository
{
    public Task<bool> AddUser(UserEntity user);

    public Task<List<UserEntity>> GetUsers();

    public Task<UserEntity?> GetUserByNic(string nic);

    public Task<bool> UpdateUser(UserEntity user);

    public Task<bool> DeleteUser(string nic);

    public Task<bool> AddSuspension(SuspensionEntity suspension);
    public Task<bool> UpdateSuspension(SuspensionEntity suspension);
    public Task<SuspensionEntity?> GetSuspension(string userNic);
    public Task<List<SuspensionEntity>> GetSuspensions(string userNic);
    public Task<SuspensionEntity?> GetSuspensionIfActive(string userNic);
    public Task<bool> UpdateSuspensionsTypeAndDate(string userNic, SuspensionType type, DateTime startDate, DateTime? endDate);
    
    public Task<bool> UpdateSuspensionIsActive(string userNic, bool isActive);

    public Task<List<SuspensionEntity>> GetSuspensionsEndingTodayOrEarlier();
    public Task<bool> DeactivateSuspension(SuspensionEntity suspension);
    public Task<bool> DeleteSuspension(string userNic);
}