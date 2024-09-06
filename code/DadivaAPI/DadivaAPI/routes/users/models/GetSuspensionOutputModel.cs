using DadivaAPI.services.users.dtos;

namespace DadivaAPI.routes.users.models;

public record GetSuspensionOutputModel(
    UserWithNameExternalInfo Donor,
    UserWithNameExternalInfo? Doctor,
    string SuspensionType,
    string SuspensionStartDate,
    string? SuspensionEndDate,
    string? Reason,
    string? SuspensionNote
);

public record GetSuspensionsOutputModel(List<GetSuspensionOutputModel> Suspensions);