using DadivaAPI.routes.users.models;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.users;

public static class UsersRoutes
{
    public static void AddUsersRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users");
        group.MapPost("/login", CreateToken);
    }

    private static async Task<IResult> CreateToken([FromBody] LoginInputModel input, IUsersService service)
    {
        Result<JwtTokenDTO, string> result = await service.CreateToken(input.Nic, input.Password);
        switch(result)
        {
            case Result<JwtTokenDTO, string>.SuccessResult success:
                return Results.Ok(success.Value);
            case Result<JwtTokenDTO, string>.FailureResult failure:
                return Results.BadRequest(failure.Error);
        }
        return Results.Ok(input);
    }
}