using DadivaAPI.domain;
using DadivaAPI.domain.user;
using DadivaAPI.routes.users.models;
using DadivaAPI.routes.utils;
using DadivaAPI.services.users;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;
using Elastic.Clients.Elasticsearch.Core.TermVectors;
using FluentResults;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.users;

public static class UsersRoutes
{
    public static void AddUsersRoutes(this IEndpointRouteBuilder app)
    {
        var usersGroup = app.MapGroup("/users");
        usersGroup.MapPost("/login", CreateToken).AllowAnonymous();

        usersGroup.MapGet("/{nic}", CheckNicExistence).AllowAnonymous(); //RequireAuthorization("doctor");

        usersGroup.MapPost("", CreateUser).RequireAuthorization("admin");
        usersGroup.MapGet("", GetUsers).RequireAuthorization("admin");
        usersGroup.MapDelete("/{nic}", DeleteUser).RequireAuthorization("admin");

        usersGroup.MapPost("/suspension", AddSuspension).AllowAnonymous();
        usersGroup.MapPost("/suspension/update", UpdateSuspension).AllowAnonymous();
        usersGroup.MapGet("/suspension/{nic:int}", GetSuspension).AllowAnonymous();
        usersGroup.MapDelete("/suspension/{nic:int}", DeleteSuspension).AllowAnonymous();
    }

    private static async Task<IResult> CreateToken(HttpContext http, [FromBody] CreateTokenInputModel input,
        IUsersService service)
    {
        return (await service.CreateToken(input.Nic, input.Password)).HandleRequest(
            token =>
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None, // Necessary for cross-origin/cross-site requests
                    Expires = DateTime.UtcNow.AddDays(1)
                };
                http.Response.Cookies.Append("token", token, cookieOptions);

                return Results.Created((string?)null,
                    new CreateTokenOutputModel(input.Nic, token));
            }
        );
    }

    private static async Task<IResult> CreateUser([FromBody] CreateUserInputModel input, IUsersService service)
    {
        return (await service.CreateUser(input.Nic, input.Name, input.Password, input.Roles, input.IsVerified,
            input.DateOfBirth, input.PlaceOfBirth)).HandleRequest(
            uei =>
                Results.Created((string?)null, new CreateUserOutputModel(uei.Nic))
        );
    }

    private static async Task<IResult> GetUsers(IUsersService service)
    {
        return (await service.GetUsers("Need to validate role")).HandleRequest(ueis =>
        {
            return Results.Ok(new GetUsersOutputModel(ueis.Select(uei => uei.Nic).ToList()));
        });
    }

    private static async Task<IResult> DeleteUser([FromRoute] string nic, IUsersService service)
    {
        return (await service.DeleteUser(nic)).HandleRequest(Results.NoContent);
    }

    private static async Task<IResult> CheckNicExistence([FromRoute] string nic, IUsersService service)
    {
        return (await service.CheckNicExistence(nic)).HandleRequest(
            uwnei =>
                Results.Ok(new CheckNicExistenceOutputModel(uwnei.Nic, uwnei.Name))
        );
    }

    private static async Task<IResult> AddSuspension([FromBody] AddSuspensionInputModel suspension, IUsersService service)
    {
        return (await service.AddSuspension(suspension)).HandleRequest(Results.Created);
    }

    private static async Task<IResult> UpdateSuspension([FromBody] UpdateSuspensionInputModel suspension, IUsersService service)
    {
        var result = await service.UpdateSuspension(suspension);
        return result switch
        {
            Result<bool, Problem>.SuccessResult => Results.NoContent(),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Unexpected result")
        };
    }

    private static async Task<IResult> GetSuspension([FromRoute] int nic, IUsersService service)
    {
        var result = await service.GetSuspension(nic);
        return result switch
        {
            Result<UserSuspension?, Problem>.SuccessResult success => Results.Ok(success.Value),
            Result<UserSuspension?, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Unexpected result")
        };
    }

    private static async Task<IResult> DeleteSuspension([FromRoute] int nic, IUsersService service)
    {
        var result = await service.DeleteSuspension(nic);
        return result switch
        {
            Result<bool, Problem>.SuccessResult => Results.NoContent(),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Unexpected result")
        };
    }
}