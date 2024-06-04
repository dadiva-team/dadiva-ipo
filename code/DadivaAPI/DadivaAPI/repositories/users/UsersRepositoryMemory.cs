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

    public Task<bool> AddUser(User user)
    {
        return Task.FromResult(users.TryAdd(user.Nic, user.HashedPassword));
    }

    public Task<List<User>> GetUsers()
    {
        throw new NotImplementedException();
    }

    public Task<User?> GetUserByNic(int nic)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteUser(int nic)
    {
        return users.Remove(nic);
    }
}