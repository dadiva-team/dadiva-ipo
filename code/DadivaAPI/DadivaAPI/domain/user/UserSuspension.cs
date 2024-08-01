namespace DadivaAPI.domain.user;

public enum SuspensionType
{
    permanent,
    betweenBloodDonations,
    other,
}

public record Suspension(
    User Donor,
    User Doctor,
    DateTime StartDate,
    SuspensionType Type,
    string? Note = null,
    string? Reason = null,
    DateTime? EndDate = null,
    int? Id = null
);