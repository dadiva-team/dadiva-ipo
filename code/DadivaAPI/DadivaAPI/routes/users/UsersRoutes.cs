using DadivaAPI.domain;
using DadivaAPI.routes.users.models;
using DadivaAPI.services.users;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.users;

public static class UsersRoutes
{
    public static void AddUsersRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users");
        group.MapPost("/login", CreateToken);
        group.MapPost("", CreateUser);
    }

    private static async Task<IResult> CreateToken([FromBody] CreateTokenInputModel input, IUsersService service)
    {
        Result<Token, Problem> result = service.CreateToken(input.Nic, input.Password);
        switch(result)
        {
            case Result<Token, Problem>.SuccessResult success:
                return Results.Ok(new CreateTokenOutputModel(success.Value.token));
            case Result<Token, Problem>.FailureResult failure:
                return Results.BadRequest(failure.Error);
        }
        return Results.Ok(input);
    }

    private static async Task<IResult> CreateUser([FromBody] CreateUserInputModel input, IUsersService service)
    {
        Result<UserExternalInfo, Problem> result = service.CreateUser(input.Nic, input.Password);
        switch(result)
        {
            case Result<UserExternalInfo, Problem>.SuccessResult success:
                return Results.Created((string)null, new CreateUserOutputModel(success.Value.Nic));
            case Result<UserExternalInfo, Problem>.FailureResult failure:
                return Results.BadRequest(failure.Error);
        }
        return Results.Ok(input);
    }
}