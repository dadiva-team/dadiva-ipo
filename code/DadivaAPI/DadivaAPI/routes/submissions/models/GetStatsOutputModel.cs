namespace DadivaAPI.routes.submissions.models;

public record GetStatsOutputModel(
    int Total,
    int Approved,
    int Denied
    );
    
public class GetDailyStatsOutputModel
{
    public DateTime Date { get; set; }
    public int Total { get; set; }
    public int Approved { get; set; }
    public int Denied { get; set; }
}
