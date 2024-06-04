using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.form;

public static class FormRoutes
{
    public static void AddFormRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/forms");
        group.MapGet("/structure", GetForm).RequireAuthorization("donor");
        group.MapPost("/submissions/{nic:int}", SubmitForm).RequireAuthorization("donor");

        group.MapPut("/structure", EditForm).RequireAuthorization("admin");
        group.MapPut("/inconsistencies", EditInconsistencies).RequireAuthorization("admin");

        group.MapGet("/submissions", GetSubmissions).RequireAuthorization("doctor", "admin");
        group.MapGet("/submissions/{nic:int}", GetSubmission).RequireAuthorization("doctor", "admin");
        //group.MapDelete("/submissions/{nic}", DeleteSubmission).RequireAuthorization("doctor","admin");
        group.MapGet("/inconsistencies", GetInconsistencies).RequireAuthorization("doctor", "admin");
    }

    private static async Task<IResult> GetSubmissions(IFormService service)
    {
        Result<Dictionary<int, Submission>, Problem> result = await service.GetSubmissions();
        return result switch
        {
            Result<Dictionary<int, Submission>, Problem>.SuccessResult success => Results.Ok(
                new GetSubmissionsOutputModel(
                    success.Value.Select(pair => new SubmissionModel(
                        pair.Key,
                        pair.Value.AnsweredQuestions.Select(AnsweredQuestionModel.FromDomain).ToList(),
                        pair.Value.SubmissionDate
                    )).ToList())),
            Result<Dictionary<int, Submission>, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }

    private static async Task<IResult> GetSubmission([FromRoute] int nic, IFormService service)
    {
        Result<Submission, Problem> result = await service.GetSubmission(nic);
        return result switch
        {
            Result<Submission, Problem>.SuccessResult success => Results.Ok(
                new SubmissionModel(
                    nic,
                    success.Value.AnsweredQuestions.Select(AnsweredQuestionModel.FromDomain).ToList(),
                    success.Value.SubmissionDate
                )),
            Result<Submission, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
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
                        success.Value.Rules
                    ),
                    options,
                    statusCode: 200),
            Result<GetFormOutputModel, Problem>.FailureResult failure =>
                Results.BadRequest(failure.Error),
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
        System.Console.WriteLine(input);
        Dictionary<string, IAnswer> answers = input.AnsweredQuestions.ToDictionary(
            question => question.QuestionId,
            question => question.Answer.ToAnswer()
        );
        System.Console.WriteLine("input");
        System.Console.WriteLine(answers);

        Result<bool, Problem> result = await service.SubmitForm(answers, nic);
        return result switch
        {
            Result<bool, Problem>.SuccessResult => Results.NoContent(),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }

    private static async Task<IResult> EditForm([FromBody] EditFormRequest input, IFormService service)
    {
        Result<Form, Problem> result = await service.EditForm(input.Groups, input.Rules);
        return result switch
        {
            Result<Form, Problem>.SuccessResult success => Results.Json(
                new GetFormOutputModel(
                    success.Value.Groups.Select(QuestionGroupModel.FromDomain).ToList(),
                    success.Value.Rules.Select(RuleModel.FromDomain).ToList()
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
}