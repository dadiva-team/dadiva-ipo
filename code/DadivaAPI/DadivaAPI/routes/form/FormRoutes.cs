using System.Text.Json;
using System.Text.Json.Serialization;
using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.form;

public static class FormRoutes
{
    public static void AddFormRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/form");
        group.MapGet("", GetForm);
        group.MapPost("", SubmitForm);
    }

    private static async Task<IResult> GetForm(IFormService service)
    {
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


    private static async Task<IResult> SubmitForm([FromBody] SubmitFormRequest input, IFormService service)
    {
        Result<Form, Problem> result = await service.SubmitForm(input.Groups, input.Rules);
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
}