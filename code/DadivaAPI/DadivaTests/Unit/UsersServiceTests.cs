using DadivaAPI.domain.user;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;
using DadivaAPI.services.users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;

namespace DadivaTests.Unit;

public class UsersServiceTests
{
    private static readonly DbContextOptions<DadivaDbContext> Options =
        new DbContextOptionsBuilder<DadivaDbContext>().UseInMemoryDatabase("userTests")
            .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning)).Options;

    private static readonly DadivaDbContext Context = new(Options);

    private static readonly Dictionary<string, string> InMemorySettings = new()
    {
        { "Jwt:Key", "thisIsAVeryGoodKeyButPleaseNeverUseItInProduction" },
        { "Jwt:Issuer", "issuer" },
        { "Jwt:Audience", "audience" }
    };

    private static readonly IConfiguration Configuration =
        new ConfigurationBuilder().AddInMemoryCollection(InMemorySettings).Build();

    private static readonly UsersService UsersService = new(Configuration, new Repository(Context), Context);

    [Fact]
    public async Task UsersServiceDoesNotBuildIfJwtKeyIsMissing()
    {
        var inMemorySettings = new Dictionary<string, string>
        {
            { "Jwt:Issuer", "issuer" },
            { "Jwt:Audience", "audience" }
        };

        var configuration = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();

        Assert.Throws<ArgumentNullException>(() => new UsersService(configuration, new Repository(Context), Context));
    }

    [Fact]
    public async Task UsersServiceDoesNotBuildIfJwtIssuerIsMissing()
    {
        var inMemorySettings = new Dictionary<string, string>
        {
            { "Jwt:Key", "key" },
            { "Jwt:Audience", "audience" }
        };

        var configuration = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();

        Assert.Throws<ArgumentNullException>(() => new UsersService(configuration, new Repository(Context), Context));
    }

    [Fact]
    public async Task UsersServiceDoesNotBuildIfJwtAudienceIsMissing()
    {
        var inMemorySettings = new Dictionary<string, string>
        {
            { "Jwt:Key", "key" },
            { "Jwt:Issuer", "issuer" }
        };

        var configuration = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();

        Assert.Throws<ArgumentNullException>(() => new UsersService(configuration, new Repository(Context), Context));
    }


    [Fact]
    public async Task CreateTokenReturnsErrorIfUserDoesNotExist()
    {
        var token = await UsersService.CreateToken("12345678", "password");

        Assert.True(token.IsFailed);
        Assert.IsType<UserError.TokenCreationError>(token.Errors.First());
    }

    [Fact]
    public async Task CreateTokenReturnsErrorIfPasswordIsIncorrect()
    {
        var user = new UserEntity
            { Nic = "12345678", HashedPassword = User.HashPassword("Password123!"), Name = "Test", Roles = [] };
        await Context.Users.AddAsync(user);
        await Context.SaveChangesAsync();

        var token = await UsersService.CreateToken("12345678", "password");

        Assert.True(token.IsFailed);
        Assert.IsType<UserError.TokenCreationError>(token.Errors.First());

        Context.Users.Remove(user);
        await Context.SaveChangesAsync();
    }

    [Fact]
    public async Task CreateTokenReturnsTokenIfUserExistsAndPasswordIsCorrect()
    {
        var user = new UserEntity
            { Nic = "12345678", HashedPassword = User.HashPassword("Password123!"), Name = "Test", Roles = [] };

        await Context.Users.AddAsync(user);
        await Context.SaveChangesAsync();
        
        var token = await UsersService.CreateToken("12345678", "Password123!");
        
        Assert.True(token.IsSuccess);
        
        Context.Users.Remove(user);
        await Context.SaveChangesAsync();
    }

    [Fact]
    public async Task CreateUserReturnsErrorIfNicIsInvalid()
    {
        var user = await UsersService.CreateUser("123456789V", "Test", "Password123!", [], null, null, null);

        Assert.True(user.IsFailed);
        Assert.IsType<UserError.TokenCreationError>(user.Errors.First()); //TODO: Invalid Nic Error
    }

    [Fact]
    public async Task CreateUserReturnsErrorIfPasswordIsInvalid()
    {
        var user = await UsersService.CreateUser("12345678", "Test", "password", [], null, null, null);
        
        Assert.True(user.IsFailed);
        Assert.IsType<UserError.TokenCreationError>(user.Errors.First()); //TODO: Invalid Password Error
    }

    [Fact]
    public async Task CreateUserReturnsErrorIfRoleIsInvalid()
    {
        var user = await UsersService.CreateUser("12345678", "Test", "Password123!", ["invalid"], null, null, null);
        
        Assert.True(user.IsFailed);
        Assert.IsType<UserError.InvalidRoleError>(user.Errors.First());
    }

    /* TODO: Fix this test
    [Fact]
    public async Task CreateUserReturnsUserIfUserIsCreated()
    {
        var user = await UsersService.CreateUser("12345678", "Test", "Password123!", [], null, null, null);
        
        Assert.True(user.IsSuccess);
        Assert.Equal("12345678", user.Value.Nic);

        Context.Users.RemoveRange(Context.Users);
        await Context.SaveChangesAsync();
    }
    */
    [Fact]
    public async Task GetUsersReturnsEmptyIfNoUsers()
    {
        var users = await UsersService.GetUsers();
        
        Assert.True(users.IsSuccess);
        Assert.Empty(users.Value);
    }

    [Fact]
    public async Task DeleteUserReturnsErrorIfUserDoesNotExist()
    {
        var user = await UsersService.DeleteUser("123");
        
        Assert.True(user.IsFailed);
        Assert.IsType<UserError.TokenCreationError>(user.Errors.First()); //TODO: Custom error
    }
    
    [Fact]
    public async Task DeleteUserReturnsSuccessIfUserIsDeleted()
    {
        var user = new UserEntity
            { Nic = "12345678", HashedPassword = User.HashPassword("Password123!"), Name = "Test", Roles = [] };

        await Context.Users.AddAsync(user);
        await Context.SaveChangesAsync();
        
        var deletedUser = await UsersService.DeleteUser("12345678");
        
        Assert.True(deletedUser.IsSuccess);
    }
    
    [Fact]
    public async Task CheckNicExistenceReturnsErrorIfUserDoesNotExist()
    {
        var user = await UsersService.CheckNicExistence("12345678");
        
        Assert.True(user.IsFailed);
        Assert.IsType<UserError.TokenCreationError>(user.Errors.First()); //TODO: Custom error
    }

    [Fact]
    public async Task CheckNicExistenceReturnsUserIfUserExists()
    {
        var userEntity = new UserEntity
            { Nic = "12345678", HashedPassword = User.HashPassword("Password123!"), Name = "Test", Roles = [] };

        await Context.Users.AddAsync(userEntity);
        await Context.SaveChangesAsync();

        var user = await UsersService.CheckNicExistence("12345678");

        Assert.True(user.IsSuccess);
        Assert.Equal("12345678", user.Value.Nic);
        Assert.Equal("Test", user.Value.Name);


        Context.Users.Remove(userEntity);
        await Context.SaveChangesAsync();
    }

    [Fact]
    public async Task AddSuspensionReturnsErrorIfDonorDoesNotExist()
    {
        var suspension =
            await UsersService.AddSuspension("12345678", "12345678", "other", "01/01/2001", "02/01/2001", "reason", "note");

        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.UnknownDonorError>(suspension.Errors.First());
    }

    [Fact]
    public async Task AddSuspensionReturnsErrorIfDoctorDoesNotExist()
    {
        var userEntity = new UserEntity { Nic = "12345678", Name = "Test", HashedPassword = "", Roles = [] };
        await Context.Users.AddAsync(userEntity);
        await Context.SaveChangesAsync();

        var suspension =
            await UsersService.AddSuspension("12345678", "87654321", "type", "startDate", "endDate", "reason", "note");

        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.UnknownDoctorError>(suspension.Errors.First());

        Context.Users.Remove(userEntity);
        await Context.SaveChangesAsync();
    }
    
    [Fact]
    public async Task AddSuspensionReturnsErrorIfSuspensionTypeIsInvalid()
    {
        var donorEntity = new UserEntity { Nic = "12345678", Name = "Test", HashedPassword = "", Roles = [] };
        var doctorEntity = new UserEntity { Nic = "87654321", Name = "Test", HashedPassword = "", Roles = [] };
        await Context.Users.AddAsync(donorEntity);
        await Context.Users.AddAsync(doctorEntity);
        await Context.SaveChangesAsync();

        var suspension =
            await UsersService.AddSuspension("12345678", "87654321", "type", "01/11/2011", null, "reason", "note");

        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.InvalidSuspensionTypeError>(suspension.Errors.First());

        Context.Users.Remove(donorEntity);
        Context.Users.Remove(doctorEntity);
        await Context.SaveChangesAsync();
    }

    [Fact]
    public async Task UpdateSuspensionReturnsErrorIfDonorDoesNotExist()
    {
        var suspension =
            await UsersService.UpdateSuspension("12345678", "12345678", "startDate", "type", "endDate", "note",
                "reason");
        
        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.UserHasNoSuspensionError>(suspension.Errors.First());
    }

    [Fact]
    public async Task UpdateSuspensionReturnsErrorIfDonorDoesNotHaveSuspension()
    {
        var userEntity = new UserEntity { Nic = "12345678", Name = "Test", HashedPassword = "", Roles = [] };
        await Context.Users.AddAsync(userEntity);
        await Context.SaveChangesAsync();
        
        var suspension =
            await UsersService.UpdateSuspension("12345678", "87654321", "startDate", "type", "endDate", "note",
                "reason");
        
        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.UserHasNoSuspensionError>(suspension.Errors.First());
        
        Context.Users.Remove(userEntity);
        await Context.SaveChangesAsync();
    }

    [Fact]
    public async Task UpdateSuspensionReturnsErrorIfEndDateTypeIsInvalid()
    {
        var userEntity = new UserEntity { Nic = "12345678", Name = "Test", HashedPassword = "", Roles = [] };
        var suspensionEntity = new SuspensionEntity
        {
            Donor = userEntity,
            Doctor = userEntity,
            StartDate = DateTime.UtcNow,
            Type = "other",
            EndDate = DateTime.UtcNow,
            IsActive = true,
            Reason = "reason",
            Note = "note"
        };
        await Context.Suspensions.AddAsync(suspensionEntity);
        await Context.SaveChangesAsync();
        
        var suspension =
            await UsersService.UpdateSuspension("12345678", "12345678", "01/01/2001", "other", null, "note",
                "reason");
        
        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.InvalidEndDateTypeError>(suspension.Errors.First());
        
        Context.Suspensions.Remove(suspensionEntity);
        Context.Users.Remove(userEntity);
        await Context.SaveChangesAsync();
    }
    
    [Fact]
    public async Task UpdateSuspensionReturnsErrorIfDoctorDoesNotExist()
    {
        var userEntity = new UserEntity { Nic = "12345678", Name = "Test", HashedPassword = "", Roles = [] };
        var suspensionEntity = new SuspensionEntity
        {
            Donor = userEntity,
            Doctor = userEntity,
            StartDate = DateTime.UtcNow,
            Type = "other",
            EndDate = DateTime.UtcNow,
            IsActive = true,
            Reason = "reason",
            Note = "note"
        };
        await Context.Suspensions.AddAsync(suspensionEntity);
        await Context.SaveChangesAsync();
        
        var suspension =
            await UsersService.UpdateSuspension("12345678", "87654321", "01/01/2001", "other", "02/01/2001", "note",
                "reason");
        
        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.UnknownDoctorError>(suspension.Errors.First());
        
        Context.Suspensions.Remove(suspensionEntity);
        Context.Users.Remove(userEntity);
        await Context.SaveChangesAsync();
    }
    
    [Fact]
    public async Task GetSuspensionReturnsErrorIfUserDoesNotExist()
    {
        var suspension = await UsersService.GetSuspension("12345678");
        
        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.TokenCreationError>(suspension.Errors.First()); //TODO: Custom Error
    }
    
    [Fact]
    public async Task GetSuspensionReturnsErrorIfUserDoesNotHaveSuspension()
    {
        var userEntity = new UserEntity { Nic = "12345678", Name = "Test", HashedPassword = "", Roles = [] };
        await Context.Users.AddAsync(userEntity);
        await Context.SaveChangesAsync();
        
        var suspension = await UsersService.GetSuspension("12345678");
        
        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.TokenCreationError>(suspension.Errors.First()); //TODO: Custom Error
        
        Context.Users.Remove(userEntity);
        await Context.SaveChangesAsync();
    }
    
    [Fact]
    public async Task DeleteSuspensionReturnsErrorIfUserDoesNotExist()
    {
        var suspension = await UsersService.DeleteSuspension("12345678");
        
        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.TokenCreationError>(suspension.Errors.First()); //TODO: Custom Error
    }
    
    [Fact]
    public async Task DeleteSuspensionReturnsErrorIfUserDoesNotHaveSuspension()
    {
        var userEntity = new UserEntity { Nic = "12345678", Name = "Test", HashedPassword = "", Roles = [] };
        await Context.Users.AddAsync(userEntity);
        await Context.SaveChangesAsync();
        
        var suspension = await UsersService.DeleteSuspension("12345678");
        
        Assert.True(suspension.IsFailed);
        Assert.IsType<UserError.TokenCreationError>(suspension.Errors.First()); //TODO: Custom Error
        
        Context.Users.Remove(userEntity);
        await Context.SaveChangesAsync();
    }
    
    [Fact]
    public async Task DeleteSuspensionReturnsSuccessIfSuspensionIsDeleted()
    {
        var userEntity = new UserEntity { Nic = "12345678", Name = "Test", HashedPassword = "", Roles = [] };
        var suspensionEntity = new SuspensionEntity
        {
            Donor = userEntity,
            Doctor = userEntity,
            StartDate = DateTime.UtcNow,
            Type = "other",
            EndDate = DateTime.UtcNow,
            IsActive = true,
            Reason = "reason",
            Note = "note"
        };
        await Context.Users.AddAsync(userEntity);
        await Context.Suspensions.AddAsync(suspensionEntity);
        await Context.SaveChangesAsync();
        
        var suspension = await UsersService.DeleteSuspension("12345678");
        
        Assert.True(suspension.IsSuccess);
        
        Context.Users.Remove(userEntity);
        await Context.SaveChangesAsync();
    }
}