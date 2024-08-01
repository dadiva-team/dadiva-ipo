using FluentResults;

namespace DadivaAPI.services.users;

public abstract class UserError : Error
{
    public class TokenCreationError() : UserError;
    public class UnknownDonor() : UserError;
    public class UnknownDoctor() : UserError;
    public class InvalidSuspensionTypeError() : UserError;
    public class UserHasNoSuspensionError() : UserError;
    public class InvalidEndDateTypeError() : UserError;
    public class UnknownError() : UserError;
}