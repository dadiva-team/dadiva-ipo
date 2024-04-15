using System.Text.Json;
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
        var group = app.MapGroup("/form");
        group.MapGet("", GetForm);
    }

    private static async Task<IResult> GetForm(IFormService service)
    {
        var options = new JsonSerializerOptions();
        //options.Converters.Add(new QuestionConverter());
        
        Result<FormExternalInfo, Problem> result = await service.GetForm();
        
        return result switch
        {
            Result<FormExternalInfo, Problem>.SuccessResult success =>
                //Results.Json(new GetFormOutputModel(success.Value.Questions), options, statusCode: 200),
                Results.Ok(new GetFormOutputModel(success.Value.Questions, success.Value.Rules)),
            Result<FormExternalInfo, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
}