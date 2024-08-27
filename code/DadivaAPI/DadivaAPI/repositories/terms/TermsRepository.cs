using DadivaAPI.domain;
using DadivaAPI.repositories.Entities;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.repositories.terms;

public class TermsRepository : ITermsRepository
{
    private readonly DadivaDbContext _context;

    public TermsRepository(DadivaDbContext context)
    {
        _context = context;
    }
    
    public async Task<TermsEntity?> GetActiveTerms(string language)
    {
        return await _context.Terms.OrderBy(term => term.Date).LastOrDefaultAsync(t=>t.Language==language);
    }

    public async Task<List<TermsEntity>?> GetTermsHistory(string language)
    {
        return await _context.Terms
            .Where(term => term.Language == language)
            .Include(t=> t.Admin)
            .OrderByDescending(term => term.Date)
            .ToListAsync();
    }

    public async Task<TermsEntity?> GetTermsById(int id)
    {
        return await _context.Terms.FindAsync(id);
    }

    public async Task<bool> SubmitTerms(TermsEntity terms)
    {
        _context.Entry(terms.Admin).State = EntityState.Unchanged;
        await _context.Terms.AddAsync(terms);
        return await _context.SaveChangesAsync() > 0;
    }
}