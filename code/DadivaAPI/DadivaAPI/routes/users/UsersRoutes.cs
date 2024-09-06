using DadivaAPI.routes.users.models;
using DadivaAPI.routes.utils;
using DadivaAPI.services.users;
using FluentResults;
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
        usersGroup.MapGet("", GetUsers).AllowAnonymous();//.RequireAuthorization("admin");
        usersGroup.MapDelete("/{nic}", DeleteUser).RequireAuthorization("admin");

        usersGroup.MapPost("/suspension", AddSuspension).AllowAnonymous();
        usersGroup.MapPost("/suspension/update", UpdateSuspension).AllowAnonymous();
        usersGroup.MapGet("/suspension/{nic}", GetSuspension).AllowAnonymous();
        usersGroup.MapGet("/suspension/{nic}/history", GetSuspensions).AllowAnonymous();
        usersGroup.MapDelete("/suspension/{nic}", DeleteSuspension).AllowAnonymous();
    }

    private static async Task<IResult> CreateToken(HttpContext http, [FromBody] CreateTokenInputModel input,
        IUsersService service)
    {
        return (await service.CreateToken(input.Nic, input.Password)).HandleRequest(
            ulei =>
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None, // Necessary for cross-origin/cross-site requests
                    Expires = DateTime.UtcNow.AddDays(1)
                };
                http.Response.Cookies.Append("token", ulei.Token, cookieOptions);

                return Results.Created((string?)null, CreateTokenOutputModel.FromExternalInfo(ulei));
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
        return (await service.GetUsers()).HandleRequest(ueis =>
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
                Results.Ok(new CheckNicExistenceOutputModel(uwnei.Name, uwnei.Nic))
        );
    }

    private static async Task<IResult> AddSuspension([FromBody] AddSuspensionInputModel suspension,
        IUsersService service)
    {
        return (await service.AddSuspension(suspension.DonorNic, suspension.DoctorNic,
                suspension.Type, suspension.StartDate, suspension.EndDate,
                suspension.Reason, suspension.Note))
            .HandleRequest(Results.Created);
    }

    private static async Task<IResult> UpdateSuspension([FromBody] UpdateSuspensionInputModel suspension,
        IUsersService service)
    {
        return (await service.UpdateSuspension(
                suspension.DonorNic,
                suspension.DoctorNic,
                suspension.StartDate,
                suspension.Type,
                suspension.EndDate,
                suspension.Note,
                suspension.Reason)
            ).HandleRequest(Results.NoContent);
    }

    private static async Task<IResult> GetSuspension([FromRoute] string nic, IUsersService service)
    {
        return (await service.GetSuspension(nic)).HandleRequest(
            suspension =>
            {
                var outputModel = new GetSuspensionOutputModel(
                    suspension.Donor,
                    suspension.Doctor,
                    suspension.SuspensionType,
                    suspension.SuspensionStartDate,
                    suspension.SuspensionEndDate,
                    suspension.Reason,
                    suspension.SuspensionNote
                );

                return Results.Ok(outputModel);
            }
        );
    }
    
    private static async Task<IResult> GetSuspensions([FromRoute] string nic, IUsersService service)
    {
        return (await service.GetSuspensions(nic)).HandleRequest(
            suspensions =>
            {
                var outputModel = new GetSuspensionsOutputModel(
                    suspensions.Select(suspension => new GetSuspensionOutputModel(
                        suspension.Donor,
                        suspension.Doctor,
                        suspension.SuspensionType,
                        suspension.SuspensionStartDate,
                        suspension.SuspensionEndDate,
                        suspension.Reason,
                        suspension.SuspensionNote
                    )).ToList()
                );

                return Results.Ok(outputModel);
            }
        );
    }
    

    private static async Task<IResult> DeleteSuspension([FromRoute] string nic, IUsersService service)
    {
        return (await service.DeleteSuspension(nic)).HandleRequest(Results.NoContent);
    }
}