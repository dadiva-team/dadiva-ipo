namespace DadivaAPI.services.submissions.dtos;

public record SubmissionStatsExternalInfo(
    int Total,
    int Approved,
    int Denied
    );
    
    
public record DailySubmissionStats
{
    public DateTime Date { get; set; }
    public int Total { get; set; }
    public int Approved { get; set; }
    public int Denied { get; set; }
}
