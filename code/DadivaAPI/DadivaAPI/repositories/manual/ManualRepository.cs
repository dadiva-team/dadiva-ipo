using DadivaAPI.repositories.Entities;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.repositories.manual;

public class ManualRepository : IManualRepository
{
    private readonly DadivaDbContext _context;

    public ManualRepository(DadivaDbContext context)
    {
        _context = context;
    }

    public async Task<List<ManualEntryEntity>> GetManualEntries(List<string> cfts)
    {
        return await _context.Cfts
            .Where(c => cfts.Contains(c.Name))
            .Select(c => c.ManualEntry)
            .ToListAsync();
    }
}