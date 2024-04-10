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
        return result switch
        {
            Result<Token, Problem>.SuccessResult success => Results.Ok(new CreateTokenOutputModel(success.Value.token)),
            Result<Token, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("never gonna give you up, never gonna let you down")
        };
    }

    private static async Task<IResult> CreateUser([FromBody] CreateUserInputModel input, IUsersService service)
    {
        Result<UserExternalInfo, Problem> result = service.CreateUser(input.Nic, input.Password);
        return result switch
        {
            Result<UserExternalInfo, Problem>.SuccessResult success => Results.Created((string)null,
                new CreateUserOutputModel(success.Value.Nic)),
            Result<UserExternalInfo, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("never gonna give you up, never gonna let you down")
        };
    }
}