using System.Text;
using DadivaAPI.repositories;
using DadivaAPI.repositories.users;
using DadivaAPI.routes.form;
using DadivaAPI.routes.users;
using DadivaAPI.services.form;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

//Jwt configuration starts here
var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtAudience = builder.Configuration.GetSection("Jwt:Audience").Get<string>();
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();

if (jwtKey == null || jwtIssuer == null || jwtAudience == null)
{
    throw new Exception("Jwt:Issuer and Jwt:Key must be provided in appsettings.json");
}

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies["token"];
            return Task.CompletedTask;
        }
    };
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});


// Adds authorization such that the jwt bearer token must contain a claim with the key "perms" and the value "admin"
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("donor", policy => policy.RequireClaim("perms", "donor", "doctor", "admin"));
    options.AddPolicy("doctor", policy => policy.RequireClaim("perms", "doctor", "admin"));
    options.AddPolicy("admin", policy => policy.RequireClaim("perms", "admin"));
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string? databaseType = builder.Configuration.GetSection("DatabaseType").Get<string>();

switch (databaseType)
{
    case "PGSQL":
        builder.Services.AddDbContext<DadivaDbContext>(options =>
            options.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=superuser;Database=postgres")
        );
        break;
    case "MEMORY":
        builder.Services.AddDbContext<DadivaDbContext>(options =>
            options.UseInMemoryDatabase("DadivaDbContext")
        );
        break;
    default:
        throw new Exception(
            "DatabaseType must be provided in appsettings.json. Aceepted values are PGSQL or MEMORY.");
}


builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IFormService, FormService>();

builder.Services.AddScoped<IRepository, Repository>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();


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

group.AddUsersRoutes();
group.AddFormRoutes();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DadivaDbContext>();
    context.Database.Migrate();  // Apply pending migrations
    PopulateDatabase.Initialize(context);
}

app.Run();