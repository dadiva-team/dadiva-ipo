using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form;
using DadivaAPI.services.form.dtos;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.form;

public static class FormRoutes
{
    public static void AddFormRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/forms");
        group.MapGet("/structure", GetForm).RequireAuthorization("donor");
        group.MapGet("/structure/{version:int}", GetFormWithVersion).AllowAnonymous();//.RequireAuthorization("doctor");
        group.MapPost("/submissions/{nic:int}", SubmitForm).RequireAuthorization("donor");

        group.MapPut("/structure", EditForm).RequireAuthorization("admin");
        group.MapPut("/inconsistencies", EditInconsistencies).RequireAuthorization("admin");

        group.MapGet("/submissions", GetPendingSubmissions).RequireAuthorization("doctor");
        group.MapGet("/submissions/{nic:int}", GetPendingSubmission).AllowAnonymous();//.RequireAuthorization("doctor");
        group.MapGet("/submissions/history/{nic:int}", GetSubmissionHistory).AllowAnonymous();//.RequireAuthorization("doctor");
        group.MapPost("/submissions/{submissionId:int}/lock", LockSubmission).AllowAnonymous();//RequireAuthorization("doctor");
        group.MapPost("/submissions/{submissionId:int}/unlock", UnlockSubmission).AllowAnonymous();//RequireAuthorization("doctor");
        //group.MapDelete("/submissions/{nic}", DeleteSubmission).RequireAuthorization("doctor");
        group.MapGet("/inconsistencies", GetInconsistencies).RequireAuthorization("doctor");
        group.MapPost("/review/{submissionId:int}", ReviewForm).RequireAuthorization("doctor");
        
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

    private static async Task<IResult> GetPendingSubmissions(IFormService service)
    {
        Result<List<SubmissionModelWithLockInfo>, Problem> result = await service.GetPendingSubmissions();
        return result switch
        {
            Result<List<SubmissionModelWithLockInfo>, Problem>.SuccessResult success => Results.Ok(
                new GetSubmissionsOutputModel(
                    success.Value.Select(submission => new SubmissionModelWithLockInfo(
                      Submission: submission.Submission, LockedByDoctorNic: submission.LockedByDoctorNic
                    )).ToList())),
            Result<List<SubmissionModelWithLockInfo>, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }

    private static async Task<IResult> GetPendingSubmission([FromRoute] int nic, IFormService service)
    {
        var result = await service.GetPendingSubmissionsByUserNic(nic);
        return result switch
        {
            Result<SubmissionModelWithLockInfo, Problem>.SuccessResult success => Results.Ok(
                new SubmissionModelWithLockInfo(
                    Submission: success.Value.Submission,
                    LockedByDoctorNic: success.Value.LockedByDoctorNic
                )),
            Result<SubmissionModelWithLockInfo, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
    
    private static async Task<IResult> GetSubmissionHistory([FromRoute] int nic, [FromQuery] int limit, [FromQuery] int skip, IFormService service)
    {
        var result = await service.GetSubmissionHistoryByNic(nic, limit, skip);
        return result switch
        {
            Result<SubmissionHistoryOutputModel, Problem>.SuccessResult success => Results.Ok(success.Value),
            Result<SubmissionHistoryOutputModel, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
    
    private static async Task<IResult> GetForm(IFormService service, ClaimsPrincipal user)
    {
        
        (user.Identity as ClaimsIdentity).Claims.ToList().ForEach(claim =>
        {
            Console.Out.WriteLine(claim.Type + ": " + claim.Value);
        });
        
        var options = new JsonSerializerOptions();
        options.Converters.Add(new JsonStringEnumConverter());

        Result<GetFormOutputModel, Problem> result = await service.GetForm();

        return result switch
        {
            Result<GetFormOutputModel, Problem>.SuccessResult success =>
                Results.Json(new GetFormOutputModel(
                        success.Value.Groups,
                        success.Value.Rules,
                        success.Value.FormVersion
                    ),
                    options,
                    statusCode: 200),
            Result<GetFormOutputModel, Problem>.FailureResult failure =>
                Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
    
    private static async Task<IResult> GetFormWithVersion([FromRoute] int version, IFormService service)
    {
        Result<GetFormWithVersionOutputModel, Problem> result = await service.GetFormWithVersion(version);
        return result switch
        {
            Result<GetFormWithVersionOutputModel, Problem>.SuccessResult success => Results.Ok(
                new GetFormWithVersionOutputModel(
                    success.Value.Groups,
                    success.Value.FormVersion
                )),
            Result<GetFormWithVersionOutputModel, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }

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

    private static async Task<IResult> SubmitForm([FromRoute] int nic, [FromBody] SubmitFormRequest input,
        IFormService service)
    {
        //System.Console.WriteLine(input);
        Dictionary<string, IAnswer> answers = input.AnsweredQuestions.ToDictionary(
            question => question.QuestionId,
            question => question.Answer.ToAnswer()
        );
        //System.Console.WriteLine("input");
        //System.Console.WriteLine(answers);

        Result<SubmitFormOutputModel, Problem> result = await service.SubmitForm(answers, nic, input.FormVersion);
        return result switch
        {
            Result<SubmitFormOutputModel, Problem>.SuccessResult success => Results.Ok(new SubmitFormOutputModel(
                success.Value.SubmissionDate,
                success.Value.SubmissionId
            )),
            Result<SubmitFormOutputModel, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }

    private static async Task<IResult> EditForm(HttpContext context, [FromBody] EditFormRequest input, IFormService service)
    {
        var user = new User(int.Parse(context.User.Claims.First(claim => claim.Type == "nic").Value), context.User.Claims.First(claim => claim.Type == "name").Value, "", Enum.Parse<Role>(context.User.Claims.First(claim => claim.Type == "perms").Value));
        Result<Form, Problem> result = await service.EditForm(input.Groups, input.Rules, user);
        return result switch
        {
            Result<Form, Problem>.SuccessResult success => Results.Json(
                new GetFormOutputModel(
                    success.Value.Groups.Select(QuestionGroupModel.FromDomain).ToList(),
                    success.Value.Rules.Select(RuleModel.FromDomain).ToList(),
                    success.Value.Id
                ), statusCode: 200),
            Result<Form, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }

    private static async Task<IResult> EditInconsistencies([FromBody] EditInconsistenciesRequest input,
        IFormService service)
    {
        Result<bool, Problem> result =
            await service.EditInconsistencies(
                new Inconsistencies(input.Inconsistencies.ConvertAll(RuleModel.ToDomain).ToList()));
        return result switch
        {
            Result<bool, Problem>.SuccessResult success => Results.Ok(input),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }

    private static async Task<IResult> GetInconsistencies(IFormService service)
    {
        Result<Inconsistencies, Problem> result = await service.GetInconsistencies();
        return result switch
        {
            Result<Inconsistencies, Problem>.SuccessResult success => Results.Json(
                new GetInconsistenciesOutputModel(
                    success.Value.InconsistencyList.Select(RuleModel.FromDomain).ToList())),
            Result<Inconsistencies, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
    private static async Task<IResult> LockSubmission([FromRoute] int submissionId, [FromBody] SubmissionLockRequest input, IFormService service)
    {
        var result = await service.LockSubmission(submissionId, input.DoctorId);
        return result switch
        {
            Result<bool, Problem>.SuccessResult => Results.NoContent(),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Unexpected result")
        };
    }

    private static async Task<IResult> UnlockSubmission([FromRoute] int submissionId, [FromBody] SubmissionUnlockRequest input, IFormService service)
    {
        var result = await service.UnlockSubmission(submissionId, input.DoctorId);
        return result switch
        {
            Result<bool, Problem>.SuccessResult => Results.NoContent(),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Unexpected result")
        };
    }
    
    private static async Task<IResult> ReviewForm(int submissionId, [FromBody] ReviewFormRequest input, IFormService service)
    {
        try
        {
            Result<Review, Problem> result = await service.ReviewForm(submissionId, input.DoctorNic, input.Status, input.FinalNote, input.Notes);
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
    }
    
}
