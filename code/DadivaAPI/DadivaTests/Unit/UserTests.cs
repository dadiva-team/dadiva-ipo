using DadivaAPI.domain.user;
using Isopoh.Cryptography.Argon2;

namespace DadivaTests.Unit;

public class UserTests
{
    [Fact]
    public void IsValidPasswordReturnsFalseIfPasswordIsInvalid()
    {
        var password = "password";

        var valid = User.IsValidPassword(password);

        Assert.False(valid);
    }

    [Fact]
    public void IsValidPasswordReturnsTrueIfPasswordIsValid()
    {
        var password = "Password123!";

        var valid = User.IsValidPassword(password);

        Assert.True(valid);
    }

    [Fact]
    public void IsValidNicReturnsFalseIfNicIsShort()
    {
        var nic = "1234567";

        var valid = User.IsValidNic(nic);

        Assert.False(valid);
    }

    [Fact]
    public void IsValidNicReturnsFalseIfNicHasNonNumbers()
    {
        var nic = "1234567a";

        var valid = User.IsValidNic(nic);

        Assert.False(valid);
    }

    [Fact]
    public void IsValidNicReturnsTrueIfNicIsValid()
    {
        var nic = "12345678";

        var valid = User.IsValidNic(nic);

        Assert.True(valid);
    }

    [Fact]
    public void HashPasswordThrowsExceptionIfPasswordIsInvalid()
    {
        var password = "password";

        Assert.Throws<ArgumentException>(() => User.HashPassword(password));
    }

    [Fact]
    public void HashPasswordReturnsHashedPasswordIfPasswordIsValid()
    {
        var password = "Password123!";

        var hashedPassword = User.HashPassword(password);

        Assert.NotEqual(password, hashedPassword);
        Assert.True(Argon2.Verify(hashedPassword, password));
    }

    [Fact]
    public void VerifyPasswordReturnsTrueIfPasswordIsCorrect()
    {
        var password = "Password123!";
        var hashedPassword = User.HashPassword(password);

        var user = new User("12345678", "John Doe", hashedPassword, []);

        var valid = user.VerifyPassword(password);

        Assert.True(valid);
    }

    [Fact]
    public void VerifyPasswordReturnsFalseIfPasswordIsIncorrect()
    {
        var password = "Password123!";
        var hashedPassword = User.HashPassword(password);

        var user = new User("12345678", "John Doe", hashedPassword, []);

        var valid = user.VerifyPassword("password");

        Assert.False(valid);
    }

    [Fact]
    public void GenerateTokenReturnsToken()
    {
        var password = "Password123!";
        var hashedPassword = User.HashPassword(password);

        var user = new User("12345678", "John Doe", hashedPassword, [Role.admin]);

        var token = user.GenerateToken("thisIsAVeryGoodKeyButPleaseNeverUseItInProduction", "issuer", "audience");

        Assert.NotNull(token);
    }

    [Fact]
    public void GenerateTokenThrowsIfKeyIsTooShort()
    {
        var password = "Password123!";
        var hashedPassword = User.HashPassword(password);

        var user = new User("12345678", "John Doe", hashedPassword, []);

        Assert.Throws<ArgumentOutOfRangeException>(() => user.GenerateToken("248BitKey......................", "issuer", "audience"));
    }
}