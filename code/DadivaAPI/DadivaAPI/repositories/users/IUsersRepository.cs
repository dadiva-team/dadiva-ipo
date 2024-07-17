using DadivaAPI.domain;

namespace DadivaAPI.repositories.users;

public interface IUsersRepository
{
    public Task<bool> AddUser(User user);

    public Task<List<User>?> GetUsers();

    public Task<User?> GetUserByNic(int nic);

    public Task<Boolean> DeleteUser(int nic);
    
    public Task<UserAccountStatus?> GetUserAccountStatus(int userNic);
    
    public Task<Boolean> UpdateUserAccountStatus(UserAccountStatus userAccountStatus);
    
    public Task<bool> AddSuspension(UserSuspension suspension);
    public Task<bool> UpdateSuspension(UserSuspension suspension);
    public Task<UserSuspension?> GetSuspension(int userNic);
    public Task<bool> DeleteSuspension(int userNic);
    
}