using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.utils;

public static class TransactionExtensions
{
    public static async Task<T> WithTransaction<T>(this DbContext context, Func<Task<T>> func)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var value = await func();
            await transaction.CommitAsync();
            return value;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}