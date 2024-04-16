namespace DadivaAPI.repositories.users;

public class UsersRepositoryMemory : IUsersRepository
{
    private Dictionary<int, string> users = new()
    {
        {123456789, "MegaPassword123!hashed"}
    };

    public bool CheckUserByNicAndPassword(int nic, string hashedPassword)
    {
        Console.Out.WriteLine("nic = {0}, password = {1}", nic, hashedPassword);
        return users.ContainsKey(nic) && users[nic] == hashedPassword;
    }

    public bool AddUser(int nic, string hashedPassword)
    {
        return users.TryAdd(nic, hashedPassword);
    }
}