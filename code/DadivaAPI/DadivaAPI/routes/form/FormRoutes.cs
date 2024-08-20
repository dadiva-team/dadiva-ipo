using System.Security.Claims;
using DadivaAPI.routes.form.models;
using DadivaAPI.routes.utils;
using DadivaAPI.services.form;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.form;

public static class FormRoutes
{
    public static void AddFormRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/forms");
        group.MapGet("/structure/{language}", GetForm)
            .AllowAnonymous();//.RequireAuthorization("doctor");
        group.MapPut("/structure", AddForm).RequireAuthorization("admin");

        group.MapGet("/inconsistencies", GetInconsistencies).RequireAuthorization("doctor");
        group.MapPut("/inconsistencies", EditInconsistencies).RequireAuthorization("admin");
    }

    private static async Task<IResult> GetForm([FromRoute] string language, IFormService service)
    {
        Console.WriteLine("Getting form for language " + language);
        return (await service.GetForm(language)).HandleRequest(form =>
        {
            return Results.Ok(new GetFormOutputModel(form.Language,form.Groups, form.Rules));
        });
    }

    private static async Task<IResult> AddForm(HttpContext context, [FromBody] EditFormRequest input,
        IFormService service)
    {   
        foreach (var userClaim in context.User.Claims)
        {
            Console.WriteLine(userClaim);
        }
        
        var nic = context.User.Claims.First(claim => claim.Type==ClaimTypes.Name).Value.ToString();
        return (await service.AddForm(input.Groups, input.Rules, input.Language, input.Reason, nic))
            .HandleRequest(Results.NoContent);
    }

    private static async Task<IResult> GetInconsistencies( IFormService service)
    {
        return (await service.GetInconsistencies()).HandleRequest(Results.Ok);
    }

    private static async Task<IResult> EditInconsistencies(
        HttpContext context,
        [FromBody] EditInconsistenciesRequest input,
        IFormService service)
    {
        var nic = context.User.Claims.First(claim => claim.Type == "nic").Value.ToString();
        return (await service.EditInconsistencies(
                input.Inconsistencies,
                nic,
                input.Language,
                input.Reason))
            .HandleRequest(Results.NoContent);
    }
}