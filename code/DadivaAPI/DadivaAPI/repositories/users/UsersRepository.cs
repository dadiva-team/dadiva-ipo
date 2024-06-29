using DadivaAPI.domain;
using Microsoft.EntityFrameworkCore;
using static DadivaAPI.repositories.utils.PGSQLUtils;
using Npgsql;

namespace DadivaAPI.repositories.users;

public class UsersRepository : IUsersRepository
{
    
    private readonly DadivaDbContext _context;
        
    public UsersRepository(DadivaDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AddUser(User user)
    {
        return (await _context.Users.AddAsync(user)).State == EntityState.Added;
    }

    public async Task<List<User>?> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetUserByNic(int nic)
    {
        foreach (var user in await _context.Users.ToListAsync())
        {
            Console.Out.WriteLine("nic: " + user.Nic + " name: " + user.Name + " password: " + user.HashedPassword + " role: " + user.Role);
        }

        return await _context.Users.FindAsync(nic);
    }

    public async Task<bool> DeleteUser(int nic)
    {
        _context.Users.Remove(await _context.Users.FindAsync(nic) ?? throw new Exception("User not found"));
        return await _context.SaveChangesAsync() > 0;
    }
    
    public async Task<UserAccountStatus?> GetUserAccountStatus(int userNic)
    {
        return await _context.UserAccountStatuses
            .FirstOrDefaultAsync(status => status.UserNic == userNic);
    }

    public async Task<bool> UpdateUserAccountStatus(UserAccountStatus userAccountStatus)
    {
        var existingStatus = await _context.UserAccountStatuses.FindAsync(userAccountStatus.UserNic);
        if (existingStatus == null)
        {
            await _context.UserAccountStatuses.AddAsync(userAccountStatus);
        }
        else
        {
            existingStatus.Status = userAccountStatus.Status;
            existingStatus.SuspendedUntil = userAccountStatus.SuspendedUntil;
            existingStatus.LastSubmissionDate = userAccountStatus.LastSubmissionDate;
            existingStatus.LastSubmissionId = userAccountStatus.LastSubmissionId;
            _context.UserAccountStatuses.Update(existingStatus);
        }
        return await _context.SaveChangesAsync() > 0;
    }
}
