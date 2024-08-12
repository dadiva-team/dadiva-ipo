using DadivaAPI.routes.form.models;
using DadivaAPI.routes.utils;
using DadivaAPI.services.reviews;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.reviews;

public static class ReviewRoutes
{
    public static void AddReviewRoutes(this IEndpointRouteBuilder app)
    {
        app.MapPost("/review/{submissionId:int}", ReviewSubmission).RequireAuthorization("doctor");
    }

    private static async Task<IResult> ReviewSubmission(int submissionId, [FromBody] ReviewSubmissionRequest input,
        IReviewsService service)
    {
        return (await service.ReviewSubmission(submissionId, input.DoctorNic, input.Status, input.Notes, input.FinalNote))
            .HandleRequest(submission => Results.Ok());
    }
}