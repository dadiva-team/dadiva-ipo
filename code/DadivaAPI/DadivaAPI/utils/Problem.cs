using Microsoft.AspNetCore.Mvc;

public class Problem
{
    public string Type { get; }
    public string Title { get; }
    public int Status { get; }
    public string Detail { get; }

    public static readonly string MediaType = "application/problem+json";

    public Problem(string type, string title, int status, string detail)
    {
        Type = type;
        Title = title;
        Status = status;
        Detail = detail;
    }

    public static IActionResult Response(Problem problem)
    {
        return new ObjectResult(problem)
        {
            StatusCode = problem.Status,
            ContentTypes = { MediaType }
        };
    }
}