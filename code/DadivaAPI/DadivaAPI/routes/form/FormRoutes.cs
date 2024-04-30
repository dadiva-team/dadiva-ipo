using System.Text.Json;
using System.Text.Json.Serialization;
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

        Result<GetFormResponse, Problem> result = await service.GetForm();

        return result switch
        {
            Result<GetFormResponse, Problem>.SuccessResult success =>
                Results.Json(new GetFormResponse(
                        success.Value.Questions,
                        success.Value.Rules
                    ),
                    options,
                    statusCode: 200),
            Result<GetFormResponse, Problem>.FailureResult failure => 
                Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }


    private static async Task<IResult> SubmitForm([FromBody] SubmitFormRequest input, IFormService service)
    {
        Result<bool, Problem> result = await service.SubmitForm(input.Questions, input.Rules);
        return result switch
        {
            Result<bool, Problem>.SuccessResult success => Results.Json(true, statusCode: 200),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
}