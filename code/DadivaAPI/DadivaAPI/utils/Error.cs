namespace DadivaAPI.utils;

using System;

// Interface definition in C#
public interface IProblem
{
    string Type { get; set; }
    string Title { get; set; }
    int Status { get; set; }
    string Detail { get; set; } // In C#, to make it optional, just check for nullability where it's used.
}

// Class implementation in C#
public class Problem : IProblem
{
    public string Type { get; set; }
    public string Title { get; set; }
    public int Status { get; set; }
    public string Detail { get; set; }

    public Problem(IProblem problem)
    {
        Type = problem.Type;
        Title = problem.Title;
        Status = problem.Status;
        Detail = problem.Detail;
    }
}
