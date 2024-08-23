using DadivaAPI.domain.user;

namespace DadivaAPI.services.users.dtos;

public record UserLoginExternalInfo(
    string Nic,
    string Token,
    bool SuspensionIsActive,
    string? SuspensionType,
    string? SuspensionStartDate,
    string? SuspensionEndDate,
    string? SuspensionReason
)
{
    public static UserLoginExternalInfo CreateUserLoginExternalInfo(string nic, string token, Suspension? suspension)
    {
        return new UserLoginExternalInfo(
            nic,
            token,
            suspension?.IsActive ?? false,
            suspension?.Type.ToString(),
            suspension?.StartDate.ToString(),
            suspension?.EndDate?.ToString(),
            suspension?.Reason
        );
    }
}