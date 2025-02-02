using System.Security.Claims;
using System.Text;
using System.Text.Json;
using DadivaAPI.repositories;
using DadivaAPI.routes.form;
using DadivaAPI.routes.manual;
using DadivaAPI.routes.medications;
using DadivaAPI.routes.reviews;
using DadivaAPI.routes.submissions;
using DadivaAPI.routes.terms;
using DadivaAPI.routes.users;
using DadivaAPI.services.form;
using DadivaAPI.services.manual;
using DadivaAPI.services.medications;
using DadivaAPI.services.reviews;
using DadivaAPI.services.submissions;
using DadivaAPI.services.terms;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using Elastic.Clients.Elasticsearch;
using Elastic.Transport;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Ensure environment variables are included
builder.Configuration.AddEnvironmentVariables();

// Load configuration from appsettings.json and override with environment variables
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Jwt configuration starts here
var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtAudience = builder.Configuration.GetSection("Jwt:Audience").Get<string>();
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();

if (jwtKey == null || jwtIssuer == null || jwtAudience == null)
{
    throw new Exception("Jwt:Issuer and Jwt:Key must be provided in appsettings.json");
}

string? frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");
if (frontendUrl == null)
{
    throw new Exception("FRONTEND_URL must be provided in the environment variables.");
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
        },
        OnChallenge = context =>
        {
            // Prevent the default behavior of returning a 401 Unauthorized status code
            context.HandleResponse();

            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            var problemDetails = new
            {
                type = frontendUrl + "/errors/unauthorized",
                title = "Unauthorized",
                detail = "You are not authorized to access this resource. Please provide valid credentials.",
                status = StatusCodes.Status401Unauthorized
            };
            var problemJson = JsonSerializer.Serialize(problemDetails);
            return context.Response.WriteAsync(problemJson);
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
    
    options.AddPolicy("donor", policy => policy.RequireClaim(ClaimTypes.Role, "donor"));
    options.AddPolicy("doctor", policy => policy.RequireClaim(ClaimTypes.Role, "doctor"));
    options.AddPolicy("admin", policy => policy.RequireClaim(ClaimTypes.Role, "admin"));
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string? databaseType = builder.Configuration.GetSection("DatabaseType").Get<string>();

switch (databaseType)
{
    case "PGSQL":
        string? connectionString = Environment.GetEnvironmentVariable("DADIVA_CONNECTION_STRING");
        if (connectionString == null)
        {
            throw new Exception("DADIVA_CONNECTION_STRING must be provided in the environment variables.");
        }

        builder.Services.AddDbContext<DadivaDbContext>(options =>
            {
                options.UseNpgsql(connectionString);
                options.EnableSensitiveDataLogging();
            }
        );
        break;
    case "MEMORY":
        builder.Services.AddDbContext<DadivaDbContext>(options =>
            options.UseInMemoryDatabase("DadivaDbContext")
        );
        break;
    default:
        throw new Exception(
            "DatabaseType must be provided in appsettings.json. Accepted values are PGSQL or MEMORY.");
}

// SSE
builder.Services.AddSingleton<INotificationService, NotificationService>();
builder.Services.AddSingleton<NotificationEndpoint>();

// Background services
builder.Services.AddHostedService<UnlockExpiredSubmissionsService>();
builder.Services.AddHostedService<DeactivateExpiredSuspensionsService>();


builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IFormService, FormService>();
builder.Services.AddScoped<ITermsService, TermsService>();
builder.Services.AddScoped<IMedicationsService, MedicationsService>();
builder.Services.AddScoped<IManualService, ManualService>();
builder.Services.AddScoped<ISubmissionService, SubmissionService>();
builder.Services.AddScoped<IReviewsService, ReviewsService>();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new AnswerConverter());
});



builder.Services.AddScoped<IRepository, Repository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy",
        policy =>
        {
            policy.WithOrigins(frontendUrl) // Frontend server address
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
group.AddTermsRoutes();
group.AddMedicationsRoutes();
group.AddManualRoutes();
group.AddReviewRoutes();
group.AddSubmissionRoutes();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DadivaDbContext>();
    context.Database.Migrate(); // Apply pending migrations
    PopulateDatabase.Initialize(context);
}

app.Run();