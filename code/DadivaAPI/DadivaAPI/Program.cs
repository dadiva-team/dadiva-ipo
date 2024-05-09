using System.Text;
using System.Text.Json.Serialization;
using DadivaAPI.domain;
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
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.Serialization;
using Elastic.Transport;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

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

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.TypeNameHandling = TypeNameHandling.Auto;
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
        });
    });

// Register the Elasticsearch client as a singleton
builder.Services.AddSingleton(new ElasticsearchClient(settings));

builder.Services.AddSingleton<IExampleService, ExampleService>();
builder.Services.AddSingleton<IUsersService, UsersService>();
builder.Services.AddSingleton<IFormService, FormService>();
builder.Services.AddSingleton<ISearchService, SearchService>();

builder.Services.AddSingleton<IUsersRepository, UsersRepositoryMemory>();
builder.Services.AddSingleton<IFormRepository, FormRepositoryMemory>();
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

(app.Services.GetService(typeof(IFormRepository)) as FormRepositoryES)?.EditForm(new Form
(
    [
        new QuestionGroup("Main", [
            new Question
            (
                "hasTraveled",
                "Ja viajou para fora de Portugal?",
                ResponseType.boolean,
                null
            ),

            new Question
            (
                "traveledWhere",
                "Para onde?",
                ResponseType.text,
                null
            )
        ])
    ],
    new List<Rule>
    {
        new Rule
        (
            new Dictionary<ConditionType, List<Evaluation>?>
            {
                { ConditionType.any, new List<Evaluation> { } }
            }!
            ,
            new Event
            (
                EventType.showQuestion,
                new EventParams("hasTraveled")
            )
        ),
        new Rule
        (
            new Dictionary<ConditionType, List<Evaluation>?>
            {
                {
                    ConditionType.any,
                    new List<Evaluation>
                    {
                        new("hasTraveled", Operator.equal, "yes")
                    }
                }
            }!
            ,
            new Event
            (
                EventType.showQuestion,
                new EventParams("traveledWhere")
            )
        )
    }
));

app.Run();