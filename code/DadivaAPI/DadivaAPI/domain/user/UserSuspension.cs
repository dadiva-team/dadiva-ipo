namespace DadivaAPI.domain.user;

public enum SuspensionType
{
    permanent,
    betweenBloodDonations,
    pendingReview,
    other,
}

public record Suspension(
    User Donor,
    User? Doctor,  // for the pending review suspension the doctor is null
    DateTime StartDate,
    SuspensionType Type,
    bool IsActive,
    string? Note = null,
    string? Reason = null,
    DateTime? EndDate = null,
    int? Id = null
);