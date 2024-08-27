using System.Security.Claims;
using DadivaAPI.services.terms;
using DadivaAPI.routes.terms.models;
using DadivaAPI.routes.utils;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.terms;

public static class TermsRoutes
{
    public static void AddTermsRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/terms");
        group.MapGet("/{language}", GetActiveTerms);
        group.MapGet("/history/{language}", GetTermsHistory);
        group.MapPost("", SubmitTerms);
    }

    private static async Task<IResult> GetActiveTerms([FromRoute] string language, ITermsService service)
    {
        return (await service.GetActiveTerms(language)).HandleRequest(
            tei =>
                Results.Ok(new GetTermsOutputModel(tei.Content))
        );
    }

    private static async Task<IResult> GetTermsHistory([FromRoute] string language, ITermsService service)
    {
        return (await service.GetTermsHistory(language)).HandleRequest(
            thei =>
                Results.Ok(new GetTermsHistoryOutputModel(
                    thei.History.Select(info =>
                        new TermsInfo(
                            info.Content,
                            info.Date,
                            info.Reason,
                            info.AuthorName,
                            info.AuthorNic)
                    ).ToList()
                ))
        );
    }

    private static async Task<IResult> SubmitTerms(
        HttpContext context,
        [FromBody] SubmitTermsInputModel terms,
        ITermsService service)
    {
        var nic = context.User.Claims.First(claim => claim.Type==ClaimTypes.Name).Value.ToString();
        return (await service.SubmitTerms(nic, terms.Content, terms.Language, terms.Reason)).HandleRequest(
            Results.NoContent
        );
    }
}