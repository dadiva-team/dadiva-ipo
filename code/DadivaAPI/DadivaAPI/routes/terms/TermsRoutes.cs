using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.services.form;
using DadivaAPI.services.terms;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.terms;

public static class TermsRoutes
{
    public static void AddTermsRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/terms");
        
        group.MapGet("", GetTerms);
        group.MapPut("", EditTerms);
    }
    
    private static async Task<IResult> GetTerms(ITermsService service)
    {
        Result<Terms?, Problem> result = await service.GetTerms();
        Console.WriteLine(result);
        return result switch
        {
            Result<Terms, Problem>.SuccessResult success => Results.Json( success.Value ),
            Result<Terms, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
    
    private static async Task<IResult> EditTerms([FromBody] Terms terms, ITermsService service)
    {
        Console.WriteLine(terms);
        Result<bool, Problem> result = await service.SubmitTerms(terms);
        Console.WriteLine(result);
        return result switch
        {
            Result<bool, Problem>.SuccessResult success => Results.Json( success.Value ),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
}