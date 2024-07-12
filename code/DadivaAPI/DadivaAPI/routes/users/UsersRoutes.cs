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
        var usersGroup = app.MapGroup("/users");
        usersGroup.MapPost("/login", CreateToken).AllowAnonymous();
        usersGroup.MapGet("/status/{nic:int}", GetUserAccountStatus).RequireAuthorization();
        usersGroup.MapPost("/update-status", UpdateUserAccountStatus).RequireAuthorization();
        
        usersGroup.MapGet("/{nic:int}", CheckNicExistence).AllowAnonymous();//RequireAuthorization("doctor");

        usersGroup.MapPost("", CreateUser).RequireAuthorization("admin");
        usersGroup.MapGet("", GetUsers).RequireAuthorization("admin");
        usersGroup.MapDelete("/{nic}", DeleteUser).RequireAuthorization("admin");
    }

    private static async Task<IResult> CreateToken(HttpContext http, [FromBody] CreateTokenInputModel input,
        IUsersService service)
    {
        Result<Token, Problem> result = await service.CreateToken(input.Nic, input.Password);
        var statusResult = await service.GetUserAccountStatus(input.Nic);
        
        switch (result, statusResult)
        {
            case (Result<Token, Problem>.SuccessResult tokenSuccess, Result<UserAccountStatus?, Problem>.SuccessResult statusSuccess):
                CookieOptions cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,  // Necessary for cross-origin/cross-site requests
                    Expires = DateTime.UtcNow.AddDays(1)
                };
                http.Response.Cookies.Append("token", tokenSuccess.Value.token, cookieOptions);
                return Results.Created((string?)null, new CreateTokenOutputModel(input.Nic, tokenSuccess.Value.token, statusSuccess.Value!));
            case (Result<Token, Problem>.FailureResult tokenFailure, _):
                return Results.NotFound(tokenFailure.Error);
            case (_, Result<UserAccountStatus?, Problem>.FailureResult statusFailure):
                return Results.BadRequest(statusFailure.Error);
            default:
                throw new Exception("never gonna give you up, never gonna let you down");
        }
    }

    private static async Task<IResult> CreateUser([FromBody] CreateUserInputModel input, IUsersService service)
    {
        Result<UserExternalInfo, Problem> result = await service.CreateUser(input.Nic, input.Name, input.Password, Enum.Parse<Role>(input.Role.ToLower()));
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
    
    private static async Task<IResult> GetUserAccountStatus([FromRoute] int nic, IUsersService service)
    {
        var result = await service.GetUserAccountStatus(nic);
        return result switch
        {
            Result<UserAccountStatus?, Problem>.SuccessResult success => Results.Ok(new
            {
                success.Value.UserNic,
                success.Value.Status,
                success.Value.SuspendedUntil,
                success.Value.LastSubmissionDate,
                success.Value.LastSubmissionId
            }),
            Result<UserAccountStatus?, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Unexpected result")
        };
    }

    private static async Task<IResult> UpdateUserAccountStatus([FromBody] UserAccountStatus userAccountStatus, IUsersService service)
    {
        var result = await service.UpdateUserAccountStatus(userAccountStatus);
        return result switch
        {
            Result<bool, Problem>.SuccessResult => Results.NoContent(),
            Result<bool, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Unexpected result")
        };
    }
    
    private static async Task<IResult> CheckNicExistence([FromRoute] int nic, IUsersService service)
    {
        var result = await service.CheckNicExistence(nic);
        return result switch
        {
            Result<UserWithNameExternalInfo, Problem>.SuccessResult success => Results.Ok(success.Value),
            Result<UserWithNameExternalInfo, Problem>.FailureResult failure => Results.BadRequest(failure.Error),
            _ => throw new Exception("Unexpected result")
        };
    }
}