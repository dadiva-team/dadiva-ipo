namespace DadivaAPI.repositories.users;

public class UsersRepositoryMemory : IUsersRepository
{
    Dictionary<int, string> users = new();

    public bool CheckUserByNicAndPassword(int nic, string hashedPassword)
    {
        return users[nic] == hashedPassword;
    }

    public bool AddUser(int nic, string hashedPassword)
    {
        return users.TryAdd(nic, hashedPassword);
    }
}