using DadivaAPI.routes.form.models;
using DadivaAPI.routes.utils;
using DadivaAPI.services.medications;
using Microsoft.AspNetCore.Mvc;


namespace DadivaAPI.routes.medications;

public static class MedicationsRoutes
{
    public static void AddMedicationsRoutes(this IEndpointRouteBuilder app)
    {
        app.MapGet("/medications/search", SearchMedications).RequireAuthorization("donor");
    }

    private static async Task<IResult> SearchMedications([FromQuery] string q, IMedicationsService service)
    {
        return (await service.SearchMedications(q)).HandleRequest(
            medications => Results.Ok(new SearchMedicationsOutputModel(medications))
        );
    }
}