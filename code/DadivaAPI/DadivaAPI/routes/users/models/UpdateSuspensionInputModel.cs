namespace DadivaAPI.routes.users.models;

public record UpdateSuspensionInputModel(
    string DonorNic,
    string DoctorNic,
    string StartDate,
    string Type,
    string? EndDate,
    string? Note,
    string? Reason
);