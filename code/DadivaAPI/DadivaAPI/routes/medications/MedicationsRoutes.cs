using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.form;
using DadivaAPI.services.interactions;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.form;

public static class MedicationsRoutes
{
    public static void AddMedicationsRoutes(this IEndpointRouteBuilder app)
    {
        app.MapGet("/medications/search", SearchMedications).RequireAuthorization("donor");
    }

    private static async Task<IResult> SearchMedications([FromQuery] string q, IMedicationsService service)
    {
        try
        {
            Result<List<string>, Problem> result = await service.SearchMedications(q);
            Console.Out.WriteLine("SearchMedications value: " + (result as Result<List<string>, Problem>.SuccessResult).Value);
            return result switch
                {
                    Result<List<string>, Problem>.SuccessResult success => Results.Ok(
                        new SearchMedicationsOutputModel(success.Value)),
                    Result<List<string>, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
                    _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
                };
        }
        catch (Exception ex)
        {
            Console.Out.WriteLine("Exception in SearchMedications: " + ex.Message);
            //exception type
            Console.Out.WriteLine("Exception type: " + ex.GetType());
            return Results.BadRequest(ex.Message);
        }
    }
}
