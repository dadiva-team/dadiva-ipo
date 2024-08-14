using DadivaAPI.domain;
using DadivaAPI.services.users.dtos;

namespace DadivaAPI.routes.users.models;

public record UserAccountStatus(
    bool IsActive,
    string? Type,
    string? StartDate,
    string? EndDate
);
public record CreateTokenOutputModel(
    string Nic,
    string Token,
    UserAccountStatus AccountStatus
)
{
    public static CreateTokenOutputModel FromExternalInfo(UserLoginExternalInfo info)
    {
        var accountStatus =  new UserAccountStatus(
            info.SuspensionIsActive,
            info.SuspensionType,
            info.SuspensionStartDate,
            info.SuspensionEndDate
        );

        return new CreateTokenOutputModel(
            info.Nic,
            info.Token,
            accountStatus
        );
    }
}
