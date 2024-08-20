using FluentResults;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.utils;

public static class HttpExtensions
{
    public static IResult HandleRequest<TIn>(
        this Result<TIn> result, Func<TIn,IResult> onSuccess)
    {
        return result.IsSuccess ? onSuccess(result.Value) : Results.Problem(ErrorToProblem(result.Errors[0]));
    }
    
    public static IResult HandleRequest(
        this Result result, Func<IResult> onSuccess)
    {
        return result.IsSuccess ? onSuccess() : Results.Problem(ErrorToProblem(result.Errors[0]));
    }
    
    private static ProblemDetails ErrorToProblem(IError error)
    {
        Console.Out.WriteLine("Error:" + error);
        return new ProblemDetails();
    }
}