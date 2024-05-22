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
using DadivaAPI.utils;
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

/*
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.TypeNameHandling = TypeNameHandling.Auto;
    options.SerializerSettings.Converters.Add(new ConditionModelJsonConverter());
});
*/

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var nodePool = new SingleNodePool(new Uri("http://localhost:9200"));
var settings = new ElasticsearchClientSettings(
    nodePool,
    sourceSerializer: (_, settings) =>
    {
        return new DefaultSourceSerializer(settings, options => { options.Converters.Add(new AnswerConverter()); });
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

(app.Services.GetService(typeof(IFormRepository)) as IFormRepository)?.EditForm(
    new Form
    (
        [
            new QuestionGroup("Dádivas Anteriores", [
                new Question
                (
                    "q2",
                    "Sente-se bem de saúde e em condições de dar sangue?",
                    ResponseType.boolean,
                    null,
                    null
                ),
                new Question
                (
                    "q3",
                    "Alguma vez deu sangue ou componentes sanguíneos?",
                    ResponseType.boolean,
                    null,
                    null
                ),
                new Question
                (
                    "q4",
                    "Deu sangue há menos de 2 meses?",
                    ResponseType.boolean,
                    null,
                    null
                ),
                new Question
                (
                    "q5",
                    "Alguma vez lhe foi aplicada uma suspensão para a dádiva de sangue?",
                    ResponseType.boolean,
                    null,
                    null
                ),
                new Question
                (
                    "q6",
                    "Ocorreu alguma reação ou incidente nas dádivas anteriores?",
                    ResponseType.boolean,
                    null,
                    null
                )
            ])/*,
            new QuestionGroup("Viagens", [
                new Question
                (
                    "Q7",
                    "Os seus pais biológicos nasceram e viveram sempre em Portugal?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q8",
                    "Nasceu e viveu sempre em Portugal?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q8-1",
                    "Quando mudou de país de residência?",
                    ResponseType.text,
                    null
                ),
                new Question
                (
                    "Q8-2",
                    "Quando mudou de país de residência?",
                    ResponseType.dropdown,
                    ["Antes de 2000"," Depois de 2000"]
                ),
                new Question
                (
                    "Q9",
                    "Alguma vez viajou para fora do país?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q10",
                    "Nos últimos 4 meses viajou (mesmo que em trânsito), residiu ou trabalhou em alguma zona com foco de transmissão ativa/surto ou endémica para doença infeciosa?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q11",
                    "Viveu no Reino Unido mais de 12 meses cumulativos, entre janeiro de 1980 e dezembro de 1996?",
                    ResponseType.boolean,
                    null
                )
            ]),
            new QuestionGroup("Saúde Geral", [
                new Question
                (
                    "Q12",
                    "Tem sido sempre saudável?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q13",
                    "Teve alguma doença crónica ou acidente grave?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q14",
                    "Já esteve internado(a) num hospital ou maternidade?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q15",
                    "Alguma vez fez uma cirurgia (incluindo cesariana)?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q16",
                    "Já teve convulsões e/ou ataques epiléticos?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q17",
                    "Foi submetido a um transplante de tecidos (ex.: córnea), células ou à administração de outros produtos biológicos?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q18",
                    "Recebeu alguma transfusão depois de 1980?",
                    ResponseType.boolean,
                    null
                )
            ]),
            new QuestionGroup("Sintomas", [
                new Question
                (
                    "Q19",
                    "Nos últimos 3 meses perdeu peso por motivos de saúde ou desconhecidos?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q20",
                    "No último mês teve algum problema de saúde (ex.: tosse, febre, dores musculares, dores de cabeça, cansaço fácil, dificuldade em respirar, falta de paladar, falta de olfato, diarreia, vómitos, alterações cutâneas ou outros)?",
                    ResponseType.boolean,
                    null
                )
            ]),
            new QuestionGroup("Possíveis Pontos de Entrada", [
                new Question
                (
                    "Q21",
                    "Nos últimos 3 meses esteve em contacto próximo com caso suspeito ou positivo de doença infecciosa?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q22",
                    "Tomou ou está a tomar medicamentos?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q23",
                    "Fez ou está a fazer profilaxia ou tratamento para doença infeciosa?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q24",
                    "Nos últimos 7 dias fez tratamento ou extração dentária?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q25",
                    "No último mês tomou alguma vacina?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q26",
                    "Fez ou está a fazer algum tratamento para a infertilidade?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q27",
                    "Está ou esteve grávida?",
                    ResponseType.boolean,
                    null
                )
            ]),
            new QuestionGroup("Mais Pontos de Entrada", [
                new Question
                (
                    "Q28",
                    "Nos últimos 4 meses fez alguma tatuagem, colocou piercing ou fez tratamento de acupuntura ou de mesoterapia?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q29",
                    "Nos últimos 4 meses fez alguna endoscopia (ex.: gastroscópia, colonoscopia, citostopia)?",
                    ResponseType.boolean,
                    null
                )
            ]),
            new QuestionGroup("Comportamentos de Risco", [
                new Question
                (
                    "Q30",
                    "Nos últimos 3 meses teve contacto sexual com uma nova pessoa",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q31",
                    "Nos últimos 3 meses teve contacto sexual com mais do que uma pessoa",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q32",
                    "Nos últimos 12 meses teve contacto sexual com uma pessoa infetada ou em tratamento para o Vírus da SIDA (VIH), Hepatite B, C ou Sífilis?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q33",
                    "Alguma vez teve contactos sexuais mediante recebimento de contrapartidas financeiras ou equivalentes (dinheiro, drogas ou outras)?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q34",
                    "Alguma vez consumiu drogas (injetáveis, inaláveis, ingeridas ou outras)?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "Q35",
                    "A pessoa com quem tem contacto sexual tem algum dos comportamentos referidos nas questões 31, 33 e 34?",
                    ResponseType.boolean,
                    null
                )
            ])*/
        ],
        []
    )
);

app.Run();