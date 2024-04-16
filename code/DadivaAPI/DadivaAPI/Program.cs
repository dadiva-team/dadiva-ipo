using System.Text;
using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.repositories.dnd;
using DadivaAPI.repositories.form;
using DadivaAPI.repositories.users;
using DadivaAPI.routes.dnd;
using DadivaAPI.routes.example;
using DadivaAPI.routes.form;
using DadivaAPI.routes.users;
using DadivaAPI.services.dnd;
using DadivaAPI.services.example;
using DadivaAPI.services.form;
using DadivaAPI.services.users;
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
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
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
builder.Services.AddSingleton<IDnDService, DnDService>();

builder.Services.AddSingleton<IUsersRepository, UsersRepositoryMemory>();
builder.Services.AddSingleton<IFormRepository, FormRepositoryMemory>();
builder.Services.AddSingleton<IDnDRepository, DnDRepositoryMemory>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy",
        policy =>
        {
            policy.WithOrigins("http://localhost:8000") // Frontend server address
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); // Important if you are sending credentials (like cookies or basic auth)
        });
});

var app = builder.Build();

app.UseCors("MyCorsPolicy");
app.UseHttpsRedirection();
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
group.AddDnDRoutes();

app.Run();