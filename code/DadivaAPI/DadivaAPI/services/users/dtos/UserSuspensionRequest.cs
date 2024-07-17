using DadivaAPI.domain;

namespace DadivaAPI.services.users.dtos;

public class UserSuspensionRequest
{
    public int UserNic { get; set; }
    public SuspensionType SuspensionType { get; set; }
    public string SuspensionStartDate { get; set; }
    public string? SuspensionEndDate { get; set; }
    public string? Reason { get; set; }
    public string? SuspensionNote { get; set; }
    public int SuspendedBy { get; set; }
}
