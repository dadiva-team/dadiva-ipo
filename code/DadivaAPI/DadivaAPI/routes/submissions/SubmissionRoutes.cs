using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.routes.utils;
using DadivaAPI.services.form;
using DadivaAPI.services.form.dtos;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Mvc;
using User = DadivaAPI.domain.user.User;

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
        //group.MapDelete("/submissions/{nic}", DeleteSubmission).RequireAuthorization("doctor");
        group.MapPost("{submissionId:int}/review/", ReviewForm).RequireAuthorization("doctor");

        app.MapGet("/notifications", async context =>
        {
            context.Response.Headers["Content-Type"] = "text/event-stream";
            context.Response.Headers["Cache-Control"] = "no-cache";
            context.Response.Headers["Connection"] = "keep-alive";

            var notificationService = context.RequestServices.GetService<INotificationService>();
            if (notificationService == null)
            {
                context.Response.StatusCode = 500;
                await context.Response.WriteAsync("Notification service not available");
                return;
            }

            var client = new NotificationClient(context);
            await notificationService.AddClientAsync(client);
            await client.ProcessAsync();
            await notificationService.RemoveClientAsync(client);
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

/*
    private static IAnswer ToAnswer(this JsonElement element)
    {
        return element.ValueKind switch
        {
            JsonValueKind.String => new StringAnswer(element.GetString()),
            JsonValueKind.True or JsonValueKind.False => new BooleanAnswer(element.GetBoolean()),
            JsonValueKind.Array => new StringListAnswer(element.EnumerateArray().Select(e => e.GetString()).ToList()),
            _ => throw new Exception("Invalid answer type")
        };
    }

    
    private static async Task<IResult> LockSubmission([FromRoute] int submissionId,
        [FromBody] SubmissionLockRequest input, IFormService service)
    {
        var result = await service.LockSubmission(submissionId, input.DoctorId);
        return result switch
        {
            Result<bool, Problem>.SuccessResult => Results.NoContent(),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Unexpected result")
        };
    }

    private static async Task<IResult> UnlockSubmission([FromRoute] int submissionId,
        [FromBody] SubmissionUnlockRequest input, IFormService service)
    {
        var result = await service.UnlockSubmission(submissionId, input.DoctorId);
        return result switch
        {
            Result<bool, Problem>.SuccessResult => Results.NoContent(),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Unexpected result")
        };
    }

    private static async Task<IResult> ReviewForm(int submissionId, [FromBody] ReviewFormRequest input,
        IFormService service)
    {
        try
        {
            Result<Review, Problem> result = await service.ReviewForm(submissionId, input.DoctorNic, input.Status,
                input.FinalNote, input.Notes);
            return result switch
            {
                Result<Review, Problem>.SuccessResult success => Results.NoContent(),
                Result<Review, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
                _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
            };
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }*/
}