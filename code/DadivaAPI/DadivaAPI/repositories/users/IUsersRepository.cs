using DadivaAPI.domain;

namespace DadivaAPI.repositories.users;

public interface IUsersRepository
{
    public Task<bool> CheckUserByNicAndPassword(int nic, string hashedPassword);
    
    public Task<bool> AddUser(User user);
    
    public Task<List<User>?> GetUsers();

    public Task<User?> GetUserByNic(int nic);
}