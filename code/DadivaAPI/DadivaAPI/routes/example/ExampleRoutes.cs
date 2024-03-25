using DadivaAPI.routes.models;
using DadivaAPI.services;

namespace DadivaAPI.routes;

public static class ExampleRoutes
{
    public static void AddExampleRoutes(this IEndpointRouteBuilder app)
    {
        app.MapGet("/example", GetExample);
    }

    private static Task<IResult> GetExample(IExampleService service)
    {
        string example = service.GetExample();
        return Task.FromResult(Results.Ok(new GetExampleOutputModel(example)));
    }
}