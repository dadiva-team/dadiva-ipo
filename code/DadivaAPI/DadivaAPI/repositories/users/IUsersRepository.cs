using DadivaAPI.domain;

namespace DadivaAPI.repositories.users;

public interface IUsersRepository
{
    //public User? GetUserByNic(int nic);
    
    public Task<bool> CheckUserByNicAndPassword(int nic, string hashedPassword);
    
    public Task<bool> AddUser(int nic, string hashedPassword);
    
    public Task<List<User>> GetUsers();

    public Task<User?> GetUserByNic(string nic);
}