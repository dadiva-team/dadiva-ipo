namespace DadivaAPI.services.users.dtos;

public record SuspensionDonorExternalInfo(
    string SuspensionType,
    string SuspensionStartDate,
    string? SuspensionEndDate,
    string? Reason,
    string? SuspensionNote
);