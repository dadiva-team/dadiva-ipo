using DadivaAPI.routes.manual.models;
using DadivaAPI.services.manual;
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
        return (await service.GetManualInformation(product)).HandleRequest(
            manualEntries => new GetManualInformationsOutputModel(
                manualEntries
                    .Select(ManualInformationOutputModel.FromDomain)
                    .ToList()
            )
        );
    }
}