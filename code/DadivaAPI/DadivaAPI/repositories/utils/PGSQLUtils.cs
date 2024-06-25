using DadivaAPI.domain;
using Npgsql;

namespace DadivaAPI.repositories.utils;

public static class PGSQLUtils
{
    public delegate Task<T> NpgsqlCommandToTFunction<T>(NpgsqlCommand command);

    public static async Task<T> InTransaction<T>(NpgsqlDataSource dataSource, NpgsqlCommandToTFunction<T> action)
    {
        await using var connection = await dataSource.OpenConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync();
        try
        {
            await using var command = new NpgsqlCommand("", connection, transaction);
            var result = await action(command);
            await transaction.CommitAsync();
            return result;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
        finally
        {
            await connection.CloseAsync();
        }
    }
}