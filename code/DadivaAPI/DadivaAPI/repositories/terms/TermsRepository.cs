using DadivaAPI.domain;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.repositories.terms;

public class TermsRepository : ITermsRepository
{
    private readonly DadivaDbContext _context;

    public TermsRepository(DadivaDbContext context)
    {
        _context = context;
    }

    public async Task<List<Terms>?> GetAllTerms()
    {
        return await _context.Terms.ToListAsync();
    }
    
    public async Task<Terms?> GetActiveTerms()
    {
        return await _context.Terms
            .Where(t => t.IsActive == true)
            .FirstOrDefaultAsync();
    }

    public async Task<Terms?> GetTermsById(int id)
    {
        return await _context.Terms.FindAsync(id);
    }

    public async Task<bool> UpdateTerms(Terms terms, TermsChangeLog changes)
    {
        _context.Terms.Update(terms);
        _context.TermsChangeLogs.Add(changes);

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<List<TermsChangeLog>?> GetTermsChangeLog(int termsId)
    {
        return await _context.TermsChangeLogs
            .Where(tcl => tcl.TermId == termsId)
            .OrderBy(tc => tc.ChangedAt)
            .ToListAsync();
    }

    public Task<bool> SubmitTerms(Terms terms)
    {
        throw new NotImplementedException();
    }
}

/*public class TermsRepository(ElasticsearchClient client) : ITermsRepository
{
    private const string TermsIndex = "terms";


    public async Task<Terms?> GetTerms()
    {
        Console.WriteLine("GetTerms");
        var response = await client.SearchAsync<Terms>(idx => idx.Index(TermsIndex));
        Console.WriteLine("response" + response.IsValidResponse);
        Console.WriteLine("response" + response.Documents.Last());
        return response.IsValidResponse ? response.Documents.Last() : null;
    }

    public async Task<bool> SubmitTerms(Terms terms)
    {
        Console.WriteLine(client.ElasticsearchClientSettings);
        Console.WriteLine("SubmitTerms");
        Console.WriteLine(terms);
        var response = await client.IndexAsync(terms, idx => idx.Index(TermsIndex));
        return response.IsValidResponse;
    }
}*/