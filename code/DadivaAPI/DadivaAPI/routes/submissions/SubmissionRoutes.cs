using DadivaAPI.routes.form.models;
using DadivaAPI.routes.utils;
using DadivaAPI.services.form;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.submissions;

public static class SubmissionRoutes
{
    public static void AddSubmissionRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/submissions");
        group.MapGet("/pending", GetPendingSubmissions).RequireAuthorization("doctor");
        group.MapGet("/pending/{nic:int}", GetPendingSubmission)
            .AllowAnonymous(); //.RequireAuthorization("doctor");
        group.MapGet("/history/{nic:int}", GetSubmissionHistory)
            .AllowAnonymous(); //.RequireAuthorization("doctor");
        group.MapPost("/{submissionId:int}/lock", LockSubmission)
            .AllowAnonymous(); //RequireAuthorization("doctor");
        group.MapPost("/{submissionId:int}/unlock", UnlockSubmission)
            .AllowAnonymous(); //RequireAuthorization("doctor");
        app.MapGet("/pending/notifications",
            async (NotificationEndpoint endpoint, HttpContext context) =>
            {
                await endpoint.HandleNotificationsAsync(context);
            });
    }

    private static async Task<IResult> GetPendingSubmissions(ISubmissionService service)
    {
        return (await service.GetPendingSubmissions()).HandleRequest(
            submissions => Results.Ok(new GetSubmissionsOutputModel(submissions))
        );
    }

    private static async Task<IResult> GetPendingSubmission([FromRoute] int nic, ISubmissionService service)
    {
        return (await service.GetPendingSubmissionsByUser(nic.ToString()))
            .HandleRequest(submission => Results.Ok(submission));
    }

    private static async Task<IResult> GetSubmissionHistory([FromRoute] int nic, [FromQuery] int limit,
        [FromQuery] int skip, ISubmissionService service)
    {
        return (await service.GetSubmissionHistoryByUser(nic.ToString(), limit, skip)).HandleRequest(
            (model => Results.Ok(model)));
    }

    private static async Task<IResult> LockSubmission([FromRoute] int submissionId,
        [FromBody] SubmissionLockRequest input, ISubmissionService service)
    {
        return (await service.LockSubmission(submissionId, input.DoctorNic)).HandleRequest(
            submissions => Results.NoContent()
        );
    }

    private static async Task<IResult> UnlockSubmission([FromRoute] int submissionId,
        [FromBody] SubmissionUnlockRequest input, ISubmissionService service)
    {
        return (await service.UnlockSubmission(submissionId, input.DoctorNic))
            .HandleRequest(submissions => Results.NoContent());
    }
}