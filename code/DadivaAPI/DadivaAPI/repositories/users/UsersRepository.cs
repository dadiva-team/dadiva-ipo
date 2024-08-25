using DadivaAPI.repositories.Entities;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.repositories.users;

public class UsersRepository : IUsersRepository
{
    private readonly DadivaDbContext _context;

    public UsersRepository(DadivaDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AddUser(UserEntity user)
    {
        await _context.Users.AddAsync(user);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<List<UserEntity>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<UserEntity?> GetUserByNic(string nic)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Nic == nic);
    }

    public async Task<bool> UpdateUser(UserEntity user)
    {
        var u = await _context.Users.FindAsync(user.Nic);
        if (u == null) return false;

        u.Token = user.Token;
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteUser(string nic)
    {
        var user = await _context.Users.FindAsync(nic);
        if (user == null)
        {
            return false;
        }

        _context.Users.Remove(user);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> AddSuspension(SuspensionEntity suspension)
    {
        await _context.Suspensions.AddAsync(suspension);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateSuspension(SuspensionEntity suspension)
    {
        var existingSuspension = await _context.Suspensions.FindAsync(suspension.Id);
        if (existingSuspension == null)
        {
            return false;
        }

        _context.Suspensions.Update(suspension);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<SuspensionEntity?> GetSuspension(string userNic)
    {
        return await _context.Suspensions
            .Include(s => s.Donor)
            .Include(s => s.Doctor)
            .FirstOrDefaultAsync(suspension => suspension.Donor.Nic == userNic);
    }

    public async Task<SuspensionEntity?> GetSuspensionIfActive(string userNic)
    {
        return await _context.Suspensions
            .Include(s => s.Donor)
            .Include(s => s.Doctor)
            .Where(suspension => suspension.Donor.Nic == userNic && suspension.IsActive)
            .OrderBy(suspension => suspension.StartDate)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteSuspension(string userNic)
    {
        var user = await _context.Users.FindAsync(userNic);
        if (user == null)
        {
            return false;
        }

        var suspension = await _context.Suspensions.FirstOrDefaultAsync(suspension => suspension.Donor.Nic == userNic);
        if (suspension == null)
        {
            return false;
        }

        _context.Suspensions.Remove(suspension);
        return await _context.SaveChangesAsync() > 0;
    }
}