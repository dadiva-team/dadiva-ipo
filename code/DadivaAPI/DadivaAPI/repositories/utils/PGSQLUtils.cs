using Npgsql;

namespace DadivaAPI.repositories.utils;

public static class PGSQLUtils
{
    public delegate Task<T> NpgsqlCommandToTFunction<T>(NpgsqlCommand command);

    public static async Task<T> InTransaction<T>(NpgsqlDataSource dataSource, NpgsqlCommandToTFunction<T> action)
    {
        var connection = await dataSource.OpenConnectionAsync();
        var transaction = await connection.BeginTransactionAsync();
        try
        {
            var result = await action(new NpgsqlCommand("", connection, transaction));
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