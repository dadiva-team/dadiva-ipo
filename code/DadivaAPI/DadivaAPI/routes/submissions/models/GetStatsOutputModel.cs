namespace DadivaAPI.routes.submissions.models;

public record GetStatsOutputModel(
    int Total,
    int Approved,
    int Denied
    );