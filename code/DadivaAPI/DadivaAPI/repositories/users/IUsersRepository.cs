namespace DadivaAPI.repositories.users;

public interface IUsersRepository
{
    public User? GetUserByNic(int nic);
    
    public User? GetUserByNicAndPassword(int nic, string password);
}