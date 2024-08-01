using DadivaAPI.domain;
using DadivaAPI.domain.user;

namespace DadivaAPI.services.users.dtos;

public record UserSuspensionRequest(
    string UserNic,
    SuspensionType SuspensionType,
    string SuspensionStartDate,
    string? SuspensionEndDate,
    string? Reason,
    string? SuspensionNote,
    string SuspendedBy);
