using System.Text;
using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.repositories.form;
using DadivaAPI.repositories.users;
using DadivaAPI.routes.example;
using DadivaAPI.routes.form;
using DadivaAPI.routes.users;
using DadivaAPI.services.example;
using DadivaAPI.services.form;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

//Jwt configuration starts here
var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();

if (jwtKey == null || jwtIssuer == null)
{
    throw new Exception("Jwt:Issuer and Jwt:Key must be provided in appsettings.json");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IExampleService, ExampleService>();
builder.Services.AddSingleton<IUsersService, UsersService>();
builder.Services.AddSingleton<IFormService, FormService>();

builder.Services.AddSingleton<IUsersRepository, UsersRepositoryMemory>();
builder.Services.AddSingleton<IFormRepository, FormRepositoryMemory>();

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(b => b
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var group = app.MapGroup("/api");

group.AddExampleRoutes();
group.AddUsersRoutes();
group.AddFormRoutes();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.Run();