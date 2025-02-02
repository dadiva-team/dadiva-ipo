using System.Security.Claims;
using DadivaAPI.routes.form.models;
using DadivaAPI.routes.submissions.models;
using DadivaAPI.routes.utils;
using DadivaAPI.services.form;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.submissions;

public static class SubmissionRoutes
{
    public static void AddSubmissionRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/submissions");
        group.MapPost("", SubmitSubmission)
            .AllowAnonymous(); //.RequireAuthorization
        group.MapGet("/pending", GetPendingSubmissions)
            .AllowAnonymous(); //.RequireAuthorization("doctor");
        group.MapGet("/pending/{donorNic:int}", GetPendingSubmission)
            .AllowAnonymous(); //.RequireAuthorization("doctor");
        group.MapGet("/history/{nic:int}", GetSubmissionHistory)
            .AllowAnonymous(); //.RequireAuthorization("doctor");
        group.MapPost("/{submissionId:int}/lock", LockSubmission)
            .AllowAnonymous(); //RequireAuthorization("doctor");
        group.MapPost("/{submissionId:int}/unlock", UnlockSubmission)
            .AllowAnonymous(); //RequireAuthorization("doctor");
        group.MapGet("/pending/notifications",
            async (NotificationEndpoint endpoint, HttpContext context) =>
            {
                await endpoint.HandleNotificationsAsync(context);
            });
        group.MapGet("/stats", GetStats).RequireAuthorization("admin");;
    }

    private static async Task<IResult> GetStats(ISubmissionService service, [FromQuery] long? unixStart,
        [FromQuery] long? unixEnd)
    {
        DateTime? startDate =
            unixStart != null ? DateTimeOffset.FromUnixTimeMilliseconds(unixStart.Value).DateTime : null;
        DateTime? endDate =
            unixEnd != null ? DateTimeOffset.FromUnixTimeMilliseconds(unixEnd.Value).DateTime : null;

        if (startDate == null && endDate != null)
            startDate = DateTime.MinValue;

        var result = await service.GetStats(startDate, endDate);
        
        return result.HandleRequest(dailyStats =>
        {
            var output = dailyStats.Select(stats => new GetDailyStatsOutputModel
            {
                Date = stats.Date,
                Total = stats.Total,
                Approved = stats.Approved,
                Denied = stats.Denied
            }).ToList();

            return Results.Ok(output);
        });
    }

    private static async Task<IResult> SubmitSubmission(HttpContext context, [FromBody] SubmitSubmissionRequest input,
        ISubmissionService service)
    {
        var nic = context.User.Claims.First(claim => claim.Type == ClaimTypes.Name).Value.ToString();
        return (await service.SubmitSubmission(nic, input.FormLanguage, input.AnsweredQuestions))
            .HandleRequest(submitted => Results.Ok(submitted));
    }

    private static async Task<IResult> GetPendingSubmissions(HttpContext context, ISubmissionService service)
    {
        var doctorNic = context.User.Claims.First(claim => claim.Type == ClaimTypes.Name).Value.ToString();
        return (await service.GetPendingSubmissions(doctorNic)).HandleRequest(
            submissions => Results.Ok(new GetSubmissionsOutputModel(submissions))
        );
    }

    private static async Task<IResult> GetPendingSubmission(HttpContext context, [FromRoute] int donorNic,
        ISubmissionService service)
    {
        var doctorNic = context.User.Claims.First(claim => claim.Type == ClaimTypes.Name).Value.ToString();
        return (await service.GetPendingSubmissionsByUser(doctorNic, donorNic.ToString()))
            .HandleRequest(submission => Results.Ok(submission));
    }

    private static async Task<IResult> GetSubmissionHistory(HttpContext context, [FromRoute] int nic,
        [FromQuery] int limit,
        [FromQuery] int skip, ISubmissionService service)
    {
        var doctorNic = context.User.Claims.First(claim => claim.Type == ClaimTypes.Name).Value.ToString();
        return (await service.GetSubmissionHistoryByUser(nic.ToString(), doctorNic, limit, skip)).HandleRequest(
            (model => Results.Ok(model)));
    }

    private static async Task<IResult> LockSubmission(HttpContext context, [FromRoute] int submissionId,
        ISubmissionService service)
    {
        var doctorNic = context.User.Claims.First(claim => claim.Type == ClaimTypes.Name).Value.ToString();
        return (await service.LockSubmission(submissionId, doctorNic)).HandleRequest(
            submissions => Results.NoContent()
        );
    }

    private static async Task<IResult> UnlockSubmission(HttpContext context, [FromRoute] int submissionId,
        ISubmissionService service)
    {
        var doctorNic = context.User.Claims.First(claim => claim.Type == ClaimTypes.Name).Value.ToString();
        return (await service.UnlockSubmission(submissionId, doctorNic))
            .HandleRequest(submissions => Results.NoContent());
    }
}