using DadivaAPI.domain;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.repositories.cftToManual;

public class CftToManualRepository : ICftToManualRepository
{
    
    private readonly DadivaDbContext _context;
    
    public CftToManualRepository(DadivaDbContext context)
    {
        _context = context;
    }
    
    public async Task<string?> GetManualEntryFromCft(string cft)
    {
        return await _context.CftToManual
            .Where(nc => nc.Cft == cft)
            .Select(nc => nc.ManualEntry)
            .FirstOrDefaultAsync();
    }
    
    public async Task<bool> AddCftToManualEntry(string cft, string manualEntry)
    {
        var cftToManualEntry = new CftToManualEntry
        {
            Cft = cft,
            ManualEntry = manualEntry
        };
        await _context.CftToManual.AddAsync(cftToManualEntry);
        return await _context.SaveChangesAsync() == 1;
    }

    public Task<List<string>> GetManualEntriesFromCfts(List<string> cfts)
    {
        Console.Out.WriteLine("GetManualEntriesFromCfts - cfts:");
        foreach (var cft in cfts)
        {
            Console.Out.WriteLine(cft);
        }

        Console.Out.WriteLine(_context);
        Console.Out.WriteLine(_context.CftToManual);
        
        return _context.CftToManual
            .Where(nc => cfts.Contains(nc.Cft))
            .Select(nc => nc.ManualEntry)
            .ToListAsync();
    }
}