using DadivaAPI.domain;
using DadivaAPI.services.terms;
using DadivaAPI.routes.terms.models;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.terms;

public static class TermsRoutes
{
    public static void AddTermsRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/terms");
        group.MapGet("", GetTerms);
        group.MapGet("/active", GetActiveTerms);
        group.MapPost("", SubmitTerms);
        group.MapPut("/{termsId:int}", UpdateTerms);
        group.MapGet("/change-log/{termsId:int}", GetCangeLog);

    }

    private static async Task<IResult> GetTerms(ITermsService service)
    {
        Result<List<Terms>, Problem> result = await service.GetTerms();
        Console.WriteLine(result);
        return result switch
        {
            Result<List<Terms>, Problem>.SuccessResult success => Results.Json(success.Value),
            Result<List<Terms>, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
    
    private static async Task<IResult> GetActiveTerms(ITermsService service)
    {
        Console.WriteLine("Getting active terms");
        Result<Terms, Problem> result = await service.GetActiveTerms();
        Console.WriteLine(result);
        return result switch
        {
            Result<Terms, Problem>.SuccessResult success => Results.Json(success.Value),
            Result<Terms, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }

    private static async Task<IResult> SubmitTerms([FromBody] Terms terms, ITermsService service)
    {
        Console.WriteLine(terms);
        Result<bool, Problem> result = await service.SubmitTerms(terms);
        Console.WriteLine(result);
        return result switch
        {
            Result<bool, Problem>.SuccessResult success => Results.Json(success.Value),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }

    private static async Task<IResult> UpdateTerms([FromRoute] int termsId,[FromBody] UpdateTermsRequest update, ITermsService service)
    {
        Console.WriteLine("UpdateTerms");
        Console.WriteLine("termsId: " + termsId);
        Console.WriteLine("update.NewContent: " + update.NewContent);
        Console.WriteLine("update.UpdatedBy: " + update.UpdatedBy);

        Result<bool, Problem> result = await service.UpdateTerms(termsId, update.UpdatedBy, update.NewContent);
        return result switch
        {
            Result<bool, Problem>.SuccessResult success => Results.Json(success.Value),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
    
    private static async Task<IResult> GetCangeLog([FromRoute] int termsId, ITermsService service)
    {
        Console.WriteLine(termsId);

        Result<List<TermsChangeLog>, Problem> result = await service.GetTermsChangeLog(termsId);
        return result switch
        {
            Result<List<TermsChangeLog>, Problem>.SuccessResult success => Results.Json(success.Value),
            Result<List<TermsChangeLog>, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Never gonna happen, c# just doesn't have proper sealed classes")
        };
    }
    
}