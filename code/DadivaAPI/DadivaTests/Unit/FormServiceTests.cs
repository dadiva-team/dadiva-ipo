using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.services.users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace DadivaTests.Unit;
using DadivaAPI.services.form;
public class FormServiceTests
{
    private static readonly DbContextOptions<DadivaDbContext> Options =
        new DbContextOptionsBuilder<DadivaDbContext>().UseInMemoryDatabase("formTests").ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning)).Options;
    private static readonly DadivaDbContext Context = new(Options);
    private static readonly FormService FormService = new(new Repository(Context), Context);
    
    [Fact]
    public async Task GetFormReturnsErrorIfNoFormIsFound()
    {
        var form = await FormService.GetForm("En");
        Assert.True(form.IsFailed);
        Assert.IsType<FormErrors.NoFormError>(form.Errors.First());
    }
    
    [Fact]
    public async Task GetFormReturnsErrorIfLanguageIsInvalid()
    {
        var form = await FormService.GetForm(".");
        Assert.True(form.IsFailed);
        Assert.IsType<FormErrors.InvalidLanguageError>(form.Errors.First());
    }
    
    [Fact]
    public async Task GetFormReturnsFormIfFormIsFound()
    {
        var admin = new UserEntity { Nic = "12345678", HashedPassword = "", Name="Test", Roles = ["admin"]};
        var formEntity = new FormEntity { Language = "En", Date = DateTime.Now, Submissions = null, Admin = admin, Rules = [], Inconsistencies = [], QuestionGroups = []};
        await Context.Forms.AddAsync(formEntity);
        await Context.SaveChangesAsync();
        var form = await FormService.GetForm("En");
        Assert.True(form.IsSuccess);
        Context.Forms.Remove(formEntity);
        Context.Users.Remove(admin);
        await Context.SaveChangesAsync();
    }
    
    [Fact]
    public async Task AddFormReturnsErrorIfUserNicDoesNotExist()
    {
        var form = await FormService.AddForm([], [], ".", null, "123456789V");
        Assert.True(form.IsFailed);
        Assert.IsType<UserError.UnknownAdminError>(form.Errors.First());
    }
    
    [Fact]
    public async Task AddFormReturnsErrorIfLanguageIsInvalid()
    {
        var user = new UserEntity { Nic = "12345678", HashedPassword = "", Name="Test", Roles = []};
        await Context.Users.AddAsync(user);
        await Context.SaveChangesAsync();
        var form = await FormService.AddForm([], [], ".", null, "12345678");
        Assert.True(form.IsFailed);
        Assert.IsType<FormErrors.InvalidLanguageError>(form.Errors.First());
        Context.Users.RemoveRange(Context.Users);
        await Context.SaveChangesAsync();
    }
    
    [Fact]
    public async Task GetInconsistenciesReturnsErrorIfNoInconsistenciesAreFound()
    {
        var inconsistencies = await FormService.GetInconsistencies();
        Assert.True(inconsistencies.IsFailed);
        Assert.IsType<FormErrors.NoInconsistenciesError>(inconsistencies.Errors.First());
    }
    
    [Fact]
    public async Task GetInconsistenciesReturnsInconsistenciesIfInconsistenciesAreFound()
    {
        var admin = new UserEntity { Nic = "12345678", HashedPassword = "", Name="Test", Roles = ["admin"]};
        var form = new FormEntity { Language = "En", Date = DateTime.Now, Submissions = null, Admin = admin, Rules = [], Inconsistencies = [], QuestionGroups = []};
        var inconsistencyEntity = new InconsistencyEntity { Admin = admin, Date = DateTime.Now, Form = form, Reason = "Reason", Rules = []};
        await Context.Inconsistencies.AddAsync(inconsistencyEntity);
        await Context.SaveChangesAsync();
        var inconsistencies = await FormService.GetInconsistencies();
        Assert.True(inconsistencies.IsSuccess);
        Context.Inconsistencies.Remove(inconsistencyEntity);
        Context.Forms.Remove(form);
        Context.Users.Remove(admin);
        await Context.SaveChangesAsync();
    }
    
    [Fact]
    public async Task EditInconsistenciesReturnsErrorIfAdminNicDoesNotExist()
    {
        var inconsistencies = await FormService.EditInconsistencies([], "123456789V", "En", null);
        Assert.True(inconsistencies.IsFailed);
        Assert.IsType<UserError.UnknownAdminError>(inconsistencies.Errors.First());
    }

    [Fact]
    public async Task EditInconsistenciesReturnsErrorIfLanguageIsInvalid()
    {
        var admin = new UserEntity { Nic = "12345678", HashedPassword = "", Name = "Test", Roles = ["admin"] };
        await Context.Users.AddAsync(admin);
        await Context.SaveChangesAsync();
        var inconsistencies = await FormService.EditInconsistencies([], "12345678", ".", null);
        Assert.True(inconsistencies.IsFailed);
        Assert.IsType<FormErrors.InvalidLanguageError>(inconsistencies.Errors.First());
        Context.Users.Remove(admin);
        await Context.SaveChangesAsync();
    }

    [Fact]
    public async Task EditInconsistenciesReturnsErrorIfNoFormIsFound()
    {
        var admin = new UserEntity { Nic = "23456781", HashedPassword = "", Name = "Test", Roles = ["admin"] };
        await Context.Users.AddAsync(admin);
        await Context.SaveChangesAsync();
        var inconsistencies = await FormService.EditInconsistencies([], "23456781", "En", null);
        Assert.True(inconsistencies.IsFailed);
        Assert.IsType<FormErrors.NoFormError>(inconsistencies.Errors.First());
        Context.Users.Remove(admin);
        await Context.SaveChangesAsync();
    }

    [Fact]
    public async Task EditInconsistenciesReturnsSuccessIfInconsistenciesAreEdited()
    {
        var admin = new UserEntity { Nic = "34567812", HashedPassword = "", Name = "Test", Roles = ["admin"] };
        var form = new FormEntity
        {
            Language = "En", Date = DateTime.Now, Submissions = null, Admin = admin, Rules = [], Inconsistencies = [],
            QuestionGroups = []
        };
        await Context.Forms.AddAsync(form);
        await Context.SaveChangesAsync();
        var inconsistencies = await FormService.EditInconsistencies([], "34567812", "En", null);
        Assert.True(inconsistencies.IsSuccess);
        Context.Forms.Remove(form);
        Context.Users.Remove(admin);
        Context.Inconsistencies.RemoveRange(Context.Inconsistencies);
        await Context.SaveChangesAsync();
    }
}