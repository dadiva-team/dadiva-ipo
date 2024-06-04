using System.Text;
using DadivaAPI.repositories.dnd;
using DadivaAPI.repositories.form;
using DadivaAPI.repositories.users;
using DadivaAPI.routes.search;
using DadivaAPI.routes.example;
using DadivaAPI.routes.form;
using DadivaAPI.routes.users;
using DadivaAPI.services.dnd;
using DadivaAPI.services.example;
using DadivaAPI.services.form;
using DadivaAPI.services.users;
using DadivaAPI.utils;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.Serialization;
using Elastic.Transport;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

var nodePool = new SingleNodePool(new Uri("http://localhost:9200"));
var settings = new ElasticsearchClientSettings(
    nodePool,
    sourceSerializer: (_, settings) =>
    {
        return new DefaultSourceSerializer(settings, options =>
        {
            options.Converters.Add(new AnswerConverter());
            options.Converters.Add(new ConditionConverter());
        });
    });

// Register the Elasticsearch client as a singleton
builder.Services.AddSingleton(new ElasticsearchClient(settings));

builder.Services.AddSingleton<IExampleService, ExampleService>();
builder.Services.AddSingleton<IUsersService, UsersService>();
builder.Services.AddSingleton<IFormService, FormService>();
builder.Services.AddSingleton<ISearchService, SearchService>();

builder.Services.AddSingleton<IUsersRepository, UsersRepositoryES>();
builder.Services.AddSingleton<IFormRepository, FormRepositoryES>();
builder.Services.AddSingleton<ISearchRepository, SearchRepositoryMemory>();

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
group.AddSearchRoutes();

app.Run();