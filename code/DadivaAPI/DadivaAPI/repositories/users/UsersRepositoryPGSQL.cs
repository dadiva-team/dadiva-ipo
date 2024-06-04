using DadivaAPI.domain;
using static DadivaAPI.repositories.utils.PGSQLUtils;
using Npgsql;

namespace DadivaAPI.repositories.users;

public class UsersRepositoryPGSQL(NpgsqlDataSource dataSource) : IUsersRepository
{
    public Task<bool> CheckUserByNicAndPassword(int nic, string hashedPassword)
    {
        return InTransaction(dataSource, async command =>
        {
            command.CommandText = "SELECT hashed_password FROM users WHERE nic = @nic";
            command.Parameters.AddWithValue("nic", nic);
            var reader = await command.ExecuteReaderAsync();
            var result = reader.Read() && reader.GetString(2) == hashedPassword;
            await reader.CloseAsync();
            return result;
        });
    }

    public async Task<bool> AddUser(User user)
    {
        return await InTransaction(dataSource, async command =>
        {
            command.CommandText = "INSERT INTO users (nic, name, hashed_password, role) VALUES (@nic, @name, @hashed_password, @role)";
            command.Parameters.AddWithValue("nic", user.Nic);
            command.Parameters.AddWithValue("name", user.Name);
            command.Parameters.AddWithValue("hashed_password", user.HashedPassword);
            command.Parameters.AddWithValue("role", user.Role.ToString());
            var reader = await command.ExecuteNonQueryAsync();
            return reader == 1;
        });
    }

    public async Task<List<User>?> GetUsers()
    {
        return await InTransaction(dataSource, async command =>
        {
            command.CommandText = "SELECT * FROM users";
            var reader = await command.ExecuteReaderAsync();
            List<User> users = [];
            while (reader.Read())
            {
                users.Add(
                    new User(
                        reader.GetInt32(0),
                        reader.GetString(1),
                        reader.GetString(2),
                        Enum.Parse<Role>(reader.GetString(3))
                    )
                );
            }

            await reader.CloseAsync();
            return users;
        });
    }

    public async Task<User?> GetUserByNic(int nic)
    {
        return await InTransaction(dataSource, async command =>
        {
            command.CommandText = "SELECT * FROM users WHERE nic = @nic";
            command.Parameters.AddWithValue("nic", nic);
            var reader = await command.ExecuteReaderAsync();
            var user = reader.Read()
                ? new User(reader.GetInt32(0), reader.GetString(1), reader.GetString(2),
                    Enum.Parse<Role>(reader.GetString(3)))
                : null;
            await reader.CloseAsync();
            return user;
        });
    }

    public async Task<bool> DeleteUser(int nic)
    {
        return await InTransaction(dataSource, async command =>
        {
            command.CommandText = "DELETE FROM users WHERE nic = @nic";
            command.Parameters.AddWithValue("nic", nic);
            var reader = await command.ExecuteNonQueryAsync();
            return reader == 1;
        });
    }
}