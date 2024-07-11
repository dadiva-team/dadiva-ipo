using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.routes.manual.models;
using DadivaAPI.services.interactions;
using DadivaAPI.services.manual;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.manual;

public static class ManualRoutes
{
    public static void AddManualRoutes(this IEndpointRouteBuilder app)
    {
        app.MapGet("/manual/{product}", GetManualInformation).RequireAuthorization("doctor");
    }

    private static async Task<IResult> GetManualInformation([FromRoute] string product, IManualService service)
    {
        Console.Out.WriteLine("GetManualInformation product: " + product);
        Result<List<ManualInformation>, Problem> result = await service.GetManualInformation(product);
        foreach (var manualInformation in (result as Result<List<ManualInformation>, Problem>.SuccessResult).Value)
        {
            Console.Out.WriteLine(manualInformation);
        }
        return result switch
        {
            Result<List<ManualInformation>, Problem>.SuccessResult success => Results.Ok(
                new GetManualInformationsOutputModel(success.Value.Select(ManualInformationOutputModel.FromDomain)
                    .ToList())),
            Result<List<ManualInformation>, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
}