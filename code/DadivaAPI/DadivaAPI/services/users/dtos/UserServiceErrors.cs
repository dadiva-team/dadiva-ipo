using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.services.users.dtos;

public interface IUserServicesError{}

public abstract class UserServiceError : IUserServicesError
{
    private UserServiceError() { }

    public static UserServiceError UserAlreadyExists { get; } = new UserAlreadyExistsError();
    private class UserAlreadyExistsError : UserServiceError { }

    public static UserServiceError InvalidNic { get; } = new InvalidNicError();
    private class InvalidNicError : UserServiceError { }

    public static UserServiceError InvalidPassword { get; } = new InvalidPasswordError();
    private class InvalidPasswordError : UserServiceError { }
    
    public static UserServiceError Unknown { get; } = new UnknownUserCreationError();
    private class UnknownUserCreationError : UserServiceError { }
}


public abstract class TokenCreationError : IUserServicesError
{
    private TokenCreationError() { }

    public static TokenCreationError UserOrPasswordAreInvalid { get; } = new UserOrPasswordAreInvalidError();
    private class UserOrPasswordAreInvalidError : TokenCreationError { }
    
    public static TokenCreationError Unknown { get; } = new UnknownTokenCreationError();
    private class UnknownTokenCreationError : TokenCreationError { }
}

public static class UserServicesErrorExtensions
{
    public static Problem ToResponse(this IUserServicesError error)
    {
        if (error is UserServiceError userCreationError)
        {
            return userCreationError switch
            {
                var userError when userError == UserServiceError.UserAlreadyExists => new Problem("userAlreadyExists.com", "User already exists", 400, "A user with the given details already exists."),
                var userError when userError == UserServiceError.InvalidNic => new Problem("invalidNic.com", "Invalid NIC", 400, "The provided NIC is invalid."),
                var userError when userError == UserServiceError.InvalidPassword => new Problem("invalidPassword.com", "Invalid Password", 400, "The provided password does not meet the security requirements."),
                var userError when userError == UserServiceError.Unknown => new Problem("unknown.co", "Unexpected error", 500, "An unexpected error occured."),
                _ => throw new ArgumentException("Unknown UserCreationError type", nameof(error))
            };
        }
        else if (error is TokenCreationError tokenCreationError)
        {
            return tokenCreationError switch
            {
                var tokenError when tokenError == TokenCreationError.UserOrPasswordAreInvalid => new Problem("type", "Invalid nic or password", 404, "The user name or password is incorrect."),
                var tokenError when tokenError == TokenCreationError.Unknown => new Problem("unknown.com", "Unexpected error", 500, "An unexpected error occured."),
                _ => throw new ArgumentException("Unknown TokenCreationError type", nameof(error))
            };
        }

        throw new ArgumentException("Unknown error type", nameof(error));
    }
}
