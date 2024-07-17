namespace DadivaAPI.domain;

public enum SuspensionType
{
    Permanent,
    BetweenBloodDonations,
    Other,
}


public class UserSuspension
{
    public int UserNic { get; set; }
    public SuspensionType SuspensionType { get; set; }
    public DateTime SuspensionStartDate { get; set; }
    public DateTime? SuspensionEndDate { get; set; }
    public string? Reason { get; set; }
    public string? SuspensionNote { get; set; }
    public int SuspendedBy { get; set; }

    public UserSuspension(int userNic, DateTime suspensionStartDate, DateTime? suspensionEndDate, string reason, string suspensionNote, SuspensionType suspensionType, int suspendedBy)
    {
        UserNic = userNic;
        SuspensionStartDate = suspensionStartDate;
        SuspensionEndDate = suspensionEndDate;
        Reason = reason;
        SuspensionNote = suspensionNote;
        SuspensionType = suspensionType;
        SuspendedBy = suspendedBy;
    }
}
