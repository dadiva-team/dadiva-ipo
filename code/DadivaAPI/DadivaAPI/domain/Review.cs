namespace DadivaAPI.domain;

public record Review( int SubmissionId, int DoctorNic, string Status, string? FinalNote, DateTime ReviewDate)
{
    public int Id { get; init; }
};