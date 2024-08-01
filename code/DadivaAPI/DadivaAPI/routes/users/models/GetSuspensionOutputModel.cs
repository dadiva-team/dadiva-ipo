namespace DadivaAPI.routes.users.models;

public record GetSuspensionOutputModel(
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