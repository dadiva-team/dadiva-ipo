using DadivaAPI.domain;
using DadivaAPI.routes.users.models;
using DadivaAPI.services.users;
using DadivaAPI.services.users.dtos;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.users;

public static class UsersRoutes
{
    public static void AddUsersRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users");
        group.MapPost("/login", CreateToken);
        group.MapPost("", CreateUser);
        group.MapGet("", GetUsers);
        group.MapDelete("/{nic}", DeleteUser);
    }

    private static async Task<IResult> CreateToken(HttpContext http, [FromBody] CreateTokenInputModel input,
        IUsersService service)
    {
        Result<Token, Problem> result = await service.CreateToken(input.Nic, input.Password);
        switch (result)
        {
            case Result<Token, Problem>.SuccessResult success:
                CookieOptions cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,   // Required if SameSite is None
                    SameSite = SameSiteMode.None,  // Necessary for cross-origin/cross-site requests
                    Expires = DateTime.UtcNow.AddDays(1)
                };
                http.Response.Cookies.Append("token", success.Value.token, cookieOptions);
                return Results.Created((string?)null, new CreateTokenOutputModel(input.Nic, success.Value.token));
            case Result<Token, Problem>.FailureResult failure:
                return Results.NotFound(failure.Error);
            default:
                throw new Exception("never gonna give you up, never gonna let you down");
        }

        ;
    }

    private static async Task<IResult> CreateUser([FromBody] CreateUserInputModel input, IUsersService service)
    {
        Result<UserExternalInfo, Problem> result = await service.CreateUser(input.Nic, input.Password);
        return result switch
        {
            Result<UserExternalInfo, Problem>.SuccessResult success => Results.Created((string)null,
                new CreateUserOutputModel(success.Value.Nic)),
            Result<UserExternalInfo, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("never gonna give you up, never gonna let you down")
        };
    }
    
    private static async Task<IResult> GetUsers(IUsersService service)
    {
        Result<List<UserExternalInfo>, Problem> result = await service.GetUsers("Need to validate role");
        return result switch
        {
            Result<List<UserExternalInfo>, Problem>.SuccessResult success => Results.Ok( success.Value),
            Result<List<UserExternalInfo>, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("never gonna give you up, never gonna let you down")
        };
    }
    
    private static async Task<IResult> DeleteUser([FromQuery] int nic ,IUsersService service)
    {
        Result<bool, Problem> result = await service.DeleteUser(nic);
        return result switch
        {
            Result<bool, Problem>.SuccessResult success => Results.Ok(success.Value),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("never gonna give you up, never gonna let you down")
        };
    }
}