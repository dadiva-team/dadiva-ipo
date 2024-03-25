namespace DadivaAPI.repositories.users;

public interface IUsersRepository
{
    //public User? GetUserByNic(int nic);
    
    public bool CheckUserByNicAndPassword(int nic, string hashedPassword);
    
    public bool AddUser(int nic, string hashedPassword);
}