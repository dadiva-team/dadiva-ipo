using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.services.terms;
using DadivaAPI.services.users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace DadivaTests.Unit;

public class TermsServiceTests
{
    private static readonly DbContextOptions<DadivaDbContext> Options =
        new DbContextOptionsBuilder<DadivaDbContext>().UseInMemoryDatabase("tests").ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning)).Options;
    private static readonly DadivaDbContext Context = new(Options);
    private static readonly TermsService TermsService = new(new Repository(Context), Context);
    
    [Fact]
    public async Task GetActiveTermsReturnsErrorIfLanguageIsInvalid()
    {
        var result = await TermsService.GetActiveTerms("invalid");
        Assert.True(result.IsFailed);
        Assert.IsType<TermsErrors.InvalidLanguageError>(result.Errors.First());
    }
    
    [Fact]
    public async Task GetActiveTermsReturnsErrorIfNoTermsAreAvailable()
    {
        var result = await TermsService.GetActiveTerms("En");
        Assert.True(result.IsFailed);
        Assert.IsType<TermsErrors.NoTermsError>(result.Errors.First());
    }
    
    [Fact]
    public async Task GetTermsHistoryReturnsErrorIfLanguageIsInvalid()
    {
        var result = await TermsService.GetTermsHistory("invalid");
        Assert.True(result.IsFailed);
        Assert.IsType<TermsErrors.InvalidLanguageError>(result.Errors.First());
    }
    
    [Fact]
    public async Task GetTermsHistoryReturnsEmptyListIfNoTermsAreAvailable()
    {
        var result = await TermsService.GetTermsHistory("En");
        Assert.True(result.IsSuccess);
        Assert.Empty(result.Value.History);
    }
    
    [Fact]
    public async Task SubmitTermsReturnsErrorIfUserDoesNotExist()
    {
        var result = await TermsService.SubmitTerms("invalid", "content", "language", null);
        Assert.True(result.IsFailed);
        Assert.IsType<UserError.UnknownAdminError>(result.Errors.First());
    }
    
    [Fact]
    public async Task SubmitTermsReturnsErrorIfLanguageIsInvalid()
    {
        var user = new UserEntity { Nic = "12345678", Name = "name", HashedPassword = "", Roles = [] };
        Context.Users.Add(user);
        await Context.SaveChangesAsync();
        
        var result = await TermsService.SubmitTerms("12345678", "content", "invalid", null);
        Assert.True(result.IsFailed);
        Assert.IsType<TermsErrors.InvalidLanguageError>(result.Errors.First());
        
        Context.Users.Remove(user);
        await Context.SaveChangesAsync();
    }
}