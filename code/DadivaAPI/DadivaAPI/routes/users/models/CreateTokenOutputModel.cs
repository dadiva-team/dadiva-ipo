using DadivaAPI.domain;
using DadivaAPI.services.users.dtos;

namespace DadivaAPI.routes.users.models;

public record UserSuspensionAccountStatus(
    bool IsActive,
    string? Type,
    string? StartDate,
    string? EndDate,
    string? Reason = null
);
public record CreateTokenOutputModel(
    string Token,
    UserSuspensionAccountStatus SuspensionAccountStatus
)
{
    public static CreateTokenOutputModel FromExternalInfo(UserLoginExternalInfo info)
    {
        var accountStatus =  new UserSuspensionAccountStatus(
            info.SuspensionIsActive,
            info.SuspensionType,
            info.SuspensionStartDate,
            info.SuspensionEndDate,
            info.SuspensionReason
        );

        return new CreateTokenOutputModel(
            info.Token,
            accountStatus
        );
    }
}
