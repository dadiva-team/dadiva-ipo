using System.Text.Json;
using DadivaAPI.services.dnd;
using DadivaAPI.utils;

namespace DadivaAPI.routes.search;

public static class SearchRoutes
{
    public static void AddSearchRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/search");
        group.MapGet("", GetDnD);
    }
    
    private static async Task<IResult> GetDnD(ISearchService service)
    {
        Result<string[], Problem> result = await service.GetDnD();
        
        return result switch
        {
            Result<string[], Problem>.SuccessResult success =>
                Results.Ok(success.Value),
            Result<string[], Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
}