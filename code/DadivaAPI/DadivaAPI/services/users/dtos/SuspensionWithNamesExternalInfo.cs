namespace DadivaAPI.services.users.dtos;

public record SuspensionWithNamesExternalInfo(
    UserWithNameExternalInfo Donor,
    UserWithNameExternalInfo? Doctor,
    string SuspensionType,
    string SuspensionStartDate,
    string? SuspensionEndDate,
    string? Reason,
    string? SuspensionNote
);

