namespace DadivaAPI.domain
{
    public enum AccountStatus
    {
        Active,
        PendingReview,
        Suspended
    }

    public class UserAccountStatus
    {
        public int UserNic { get; set; }
        public AccountStatus Status { get; set; }
        public DateTime? SuspendedUntil { get; set; }
        public DateTime? LastSubmissionDate { get; set; } 
        public int? LastSubmissionId { get; set; }

        public UserAccountStatus(int userNic, AccountStatus status, DateTime? suspendedUntil, DateTime? lastSubmissionDate, int? lastSubmissionId)
        {
            UserNic = userNic;
            Status = status;
            SuspendedUntil = suspendedUntil;
            LastSubmissionDate = lastSubmissionDate;
            LastSubmissionId = lastSubmissionId;
        }
    }
}