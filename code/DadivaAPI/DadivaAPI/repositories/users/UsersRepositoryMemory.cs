using DadivaAPI.domain;

namespace DadivaAPI.repositories.users;

public class UsersRepositoryMemory : IUsersRepository
{
    private Dictionary<int, string> users = new()
    {
        {123456789, "MegaPassword123!hashed"}
    };

    public Task<bool> CheckUserByNicAndPassword(int nic, string hashedPassword)
    {
        Console.Out.WriteLine("nic = {0}, password = {1}", nic, hashedPassword);
        return Task.FromResult(users.ContainsKey(nic) && users[nic] == hashedPassword);
    }

    public Task<bool> AddUser(int nic, string hashedPassword)
    {
        return Task.FromResult(users.TryAdd(nic, hashedPassword));
    }

    public Task<List<User>> GetUsers()
    {
        throw new NotImplementedException();
    }

    public Task<User?> GetUserByNic(string nic)
    {
        throw new NotImplementedException();
    }
}