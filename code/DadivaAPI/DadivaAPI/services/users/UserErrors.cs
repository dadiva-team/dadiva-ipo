using FluentResults;

namespace DadivaAPI.services.users;

public abstract class UserError : Error
{
    public class TokenCreationError() : UserError;
}