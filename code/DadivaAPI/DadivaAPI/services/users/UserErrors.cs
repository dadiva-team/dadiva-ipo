using FluentResults;

namespace DadivaAPI.services.users;

public abstract class UserError : Error
{
    public class TokenCreationError() : UserError;

    public class UnknownDonorError() : UserError;

    public class UnknownDoctorError() : UserError;

    public class UnknownAdminError() : UserError;

    public class SuspendedDonorError() : UserError;

    public class InvalidSuspensionTypeError() : UserError;

    public class UserHasNoSuspensionError() : UserError;
    
    public class SuspensionNotDeletedError() : UserError;

    public class InvalidEndDateTypeError() : UserError;
    
    public class InvalidRoleError() : UserError;

    public class UnknownError() : UserError;
}