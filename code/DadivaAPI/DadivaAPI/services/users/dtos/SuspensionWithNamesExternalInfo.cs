namespace DadivaAPI.services.users.dtos;

public record SuspensionWithNamesExternalInfo(
    string DonorNic,
    string DonorName,
    string DoctorNic,
    string DoctorName,
    string SuspensionType,
    string SuspensionStartDate,
    string? SuspensionEndDate,
    string? Reason,
    string? SuspensionNote
);