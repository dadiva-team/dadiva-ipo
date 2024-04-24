namespace DadivaAPI.repositories.users;

public interface IUsersRepository
{
    //public User? GetUserByNic(int nic);
    
    public Task<bool> CheckUserByNicAndPassword(int nic, string hashedPassword);
    
    public Task<bool> AddUser(int nic, string hashedPassword);
}