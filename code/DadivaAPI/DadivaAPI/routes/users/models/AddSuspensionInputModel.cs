namespace DadivaAPI.routes.users.models;

public record AddSuspensionInputModel(
    string DonorNic,
    string DoctorNic,
    string Type,
    string StartDate,
    string? EndDate,
    string? Reason,
    string? Note
);