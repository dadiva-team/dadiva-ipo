using System.Text.Json;
using DadivaAPI.services.dnd;
using DadivaAPI.utils;

namespace DadivaAPI.routes.dnd;

public static class DnDRoutes
{
    public static void AddDnDRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/dnd");
        group.MapGet("", GetDnD);
    }
    
    private static async Task<IResult> GetDnD(IDnDService service)
    {
        var options = new JsonSerializerOptions();
        //options.Converters.Add(new QuestionConverter());
        
        Result<string[], Problem> result = await service.GetDnD();
        
        return result switch
        {
            Result<string[], Problem>.SuccessResult success =>
                //Results.Json(new GetFormOutputModel(success.Value.Questions), options, statusCode: 200),
                Results.Ok(success.Value),
            Result<string[], Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
}