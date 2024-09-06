using FluentResults;

namespace DadivaAPI.services.users;

public abstract class UserError : Error
{
    public class TokenCreationError() : UserError;
    public class TokenRevokeError() : UserError;
    public class UserNotFoundError() : UserError;
    public class UserNotDeletedError() : UserError;
    public class UnknownDonorError() : UserError;

    public class UnknownDoctorError() : UserError;

    public class UnknownAdminError() : UserError;

    public class SuspendedDonorError(string?  Reason) : UserError;

    public class InvalidSuspensionTypeError() : UserError;

    public class UserHasNoSuspensionError() : UserError;
    
    public class SuspensionNotDeletedError() : UserError;
    public class SuspensionNotUpdatedError() : UserError;
    
    public class SuspensionNotAddedError() : UserError;

    public class InvalidEndDateTypeError() : UserError;
    
    public class InvalidRoleError() : UserError;

    public class UnknownError() : UserError;
}