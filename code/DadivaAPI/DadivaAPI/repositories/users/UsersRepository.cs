using DadivaAPI.domain;
using Microsoft.EntityFrameworkCore;

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
        await _context.Users.AddAsync(user);
        return await _context.SaveChangesAsync() > 0;
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
        return await _context.UserAccountStatus
            .FirstOrDefaultAsync(status => status.UserNic == userNic);
    }

    public async Task<bool> UpdateUserAccountStatus(UserAccountStatus userAccountStatus)
    {
        var existingStatus = await _context.UserAccountStatus.FindAsync(userAccountStatus.UserNic);
        if (existingStatus == null)
        {
            await _context.UserAccountStatus.AddAsync(userAccountStatus);
        }
        else
        {
            existingStatus.Status = userAccountStatus.Status;
            existingStatus.SuspendedUntil = userAccountStatus.SuspendedUntil;
            existingStatus.LastSubmissionDate = userAccountStatus.LastSubmissionDate;
            existingStatus.LastSubmissionId = userAccountStatus.LastSubmissionId;
            _context.UserAccountStatus.Update(existingStatus);
        }
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> AddSuspension(UserSuspension suspension)
    {
        await _context.UserSuspensions.AddAsync(suspension);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateSuspension(UserSuspension suspension)
    {
        var existingSuspension = await _context.UserSuspensions.FindAsync(suspension.UserNic);
        if (existingSuspension == null)
        {
            return false;
        }
        existingSuspension.SuspensionStartDate = suspension.SuspensionStartDate;
        existingSuspension.SuspensionEndDate = suspension.SuspensionEndDate;
        existingSuspension.Reason = suspension.Reason;
        existingSuspension.SuspensionNote = suspension.SuspensionNote;
        existingSuspension.SuspensionType = suspension.SuspensionType;
        _context.UserSuspensions.Update(existingSuspension);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<UserSuspension?> GetSuspension(int userNic)
    {
        return await _context.UserSuspensions
            .FirstOrDefaultAsync(suspension => suspension.UserNic == userNic);
    }

    public async Task<bool> DeleteSuspension(int userNic)
    {
        var suspension = await _context.UserSuspensions.FindAsync(userNic);
        if (suspension == null)
        {
            return false;
        }
        _context.UserSuspensions.Remove(suspension);
        return await _context.SaveChangesAsync() > 0;
    }
}
