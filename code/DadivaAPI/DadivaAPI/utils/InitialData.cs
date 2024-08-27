using DadivaAPI.domain;
using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;
using User = DadivaAPI.domain.user.User;

namespace DadivaAPI.utils;

public class InitialData
{
    private static readonly User Admin = new(
        "87654321",
        "Eng. Doe",
        User.HashPassword("MegaPassword123!"),
        [Role.admin, Role.doctor, Role.donor],
        null,
        true,
        null,
        null
    );

    private static readonly User Doctor = new(
        "11111111",
        "Dr. Doe",
        User.HashPassword("MegaPassword123!"),
        [Role.doctor, Role.donor],
        null,
        true,
        null,
        null
    );

    private static readonly User Donor = new(
        "12345678",
        "John Doe",
        User.HashPassword("MegaPassword123!"),
        [Role.donor],
        null,
        true,
        null,
        null
    );

    public static readonly List<UserEntity> Users =
    [
        Admin.ToEntity(),
        Doctor.ToEntity(),
        Donor.ToEntity()
    ];

    /*
    public static readonly UserAccountStatus DonorStatus = new UserAccountStatus
    (
        Donor.Nic,
        AccountStatus.Active,
        null,
        null,
        null
    );

    public static readonly UserAccountStatus AdminStatus = new UserAccountStatus
    (
        Admin.Nic,
        AccountStatus.Active,
        null,
        null,
        null
    );

    public static readonly UserAccountStatus DoctorStatus = new UserAccountStatus
    (
        Doctor.Nic,
        AccountStatus.Active,
        null,
        null,
        null
    );

    public static readonly List<UserAccountStatus> UserAccountStatuses =
    [
        DonorStatus,
        AdminStatus,
        DoctorStatus
    ];*/

    private static readonly Terms TestTerms1 = new
    (
        Admin,
        "<p>Test1</p>",
        TermsLanguages.En,
        DateTime.UtcNow
    );

    private static readonly Terms TestTerms2 = new
    (
        Admin,
        "<p>Test2</p>",
        TermsLanguages.En,
        DateTime.UtcNow
    );

    private static readonly TermsEntity TestTerms1Entity = TestTerms1.ToEntity(null, Users[0], null);
    private static readonly TermsEntity TestTerms2Entity = TestTerms2.ToEntity(TestTerms1Entity, Users[0], "Test2");

    public static readonly List<TermsEntity> Terms =
    [
        TestTerms1Entity,
        TestTerms2Entity
    ];

/*    public static readonly TermsChangeLog TestTermsChangeLog = new
    (
        1,
        Admin.Nic,
        DateTime.UtcNow,
        "<p>OldContent</p>",
        "<p>Test1</p>"
    );*/

    private static readonly Form testForm = new Form
    (
        [
            new QuestionGroup("Dádivas Anteriores", [
                new Question
                (
                    "1",
                    "Quais os medicamentos que toma?",
                    ResponseType.medications,
                    null
                )
            ]),
            new QuestionGroup("Dádivas Anteriores 2", [
                new Question(
                    "2",
                    "Alguma vez deu sangue ou componentes sanguíneos?",
                    ResponseType.boolean,
                    null
                )
            ])
        ],
        [
            new Rule(new LogicalCondition([], []), new Event(EventType.showQuestion, new EventParams("q2"))),
            new Rule(new LogicalCondition([new EvaluationCondition("q2", Operator.notEqual, "")], []),
                new Event(EventType.nextGroup, null)),
            new Rule(new LogicalCondition([], []), new Event(EventType.showQuestion, new EventParams("q3"))),
            new Rule(new LogicalCondition([new EvaluationCondition("q3", Operator.notEqual, "")], []),
                new Event(EventType.showReview, null))
        ],
        FormLanguages.Pt,
        Admin
        //DateTime.Now.ToUniversalTime()
    );

    private static readonly List<QuestionGroup> Questions =
    [
        new QuestionGroup("Dádivas Anteriores", [
            new Question
            (
                "1",
                "Sente-se bem de saúde e em condições de dar sangue?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "2",
                "Alguma vez deu sangue ou componentes sanguíneos?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "2_3",
                "Deu sangue há menos de 2 meses?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "2_4",
                "Alguma vez lhe foi aplicada uma suspensão para a dádiva de sangue?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "2_5",
                "Ocorreu alguma reação ou incidente nas dádivas anteriores?",
                ResponseType.boolean,
                null
            )
        ]),
        new QuestionGroup("Viagens", [
            new Question
            (
                "6",
                "Os seus pais biológicos nasceram e viveram sempre em Portugal?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "7",
                "Nasceu e viveu sempre em Portugal?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "8",
                "Alguma vez viajou para fora do país?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "8_9",
                "Para onde viajou?",
                ResponseType.countries,
                null
            ),
            new Question
            (
                "10",
                "Nos últimos 4 meses viajou (mesmo que em trânsito), residiu ou trabalhou em alguma zona com foco de transmissão ativa/surto ou endémica para doença infeciosa?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "11",
                "Viveu no Reino Unido mais de 12 meses cumulativos, entre janeiro de 1980 e dezembro de 1996?",
                ResponseType.boolean,
                null
            )
        ]),
        new QuestionGroup("Saúde Geral", [
            new Question
            (
                "12",
                "Tem sido sempre saudável?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "13",
                "Teve alguma doença crónica ou acidente grave?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "14",
                "Já esteve internado(a) num hospital ou maternidade?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "15",
                "Alguma vez fez uma cirurgia (incluindo cesariana)?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "16",
                "Já teve convulsões e/ou ataques epiléticos?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "17",
                "Foi submetido a um transplante de tecidos (ex.: córnea), células ou à administração de outros produtos biológicos?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "18",
                "Recebeu alguma transfusão depois de 1980?",
                ResponseType.boolean,
                null
            )
        ]),
        new QuestionGroup("Sintomas", [
            new Question
            (
                "19",
                "Nos últimos 3 meses perdeu peso por motivos de saúde ou desconhecidos?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "20",
                "No último mês teve algum problema de saúde (ex.: tosse, febre, dores musculares, dores de cabeça, cansaço fácil, dificuldade em respirar, falta de paladar, falta de olfato, diarreia, vómitos, alterações cutâneas ou outros)?",
                ResponseType.boolean,
                null
            )
        ]),
        new QuestionGroup("Possíveis Pontos de Entrada", [
            new Question
            (
                "21",
                "Nos últimos 3 meses esteve em contacto próximo com caso suspeito ou positivo de doença infecciosa?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "22",
                "Tomou ou está a tomar medicamentos?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "22_23",
                "Quais os medicamentos que tomou ou está a tomar?",
                ResponseType.medications,
                null
            ),
            new Question
            (
                "24",
                "Fez ou está a fazer profilaxia ou tratamento para doença infeciosa?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "25",
                "Nos últimos 7 dias fez tratamento ou extração dentária?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "26",
                "No último mês tomou alguma vacina?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "27",
                "Fez ou está a fazer algum tratamento para a infertilidade?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "28",
                "Está ou esteve grávida?",
                ResponseType.boolean,
                null
            )
        ]),
        new QuestionGroup("Mais Pontos de Entrada", [
            new Question
            (
                "29",
                "Nos últimos 4 meses fez alguma tatuagem, colocou piercing ou fez tratamento de acupuntura ou de mesoterapia?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "30",
                "Nos últimos 4 meses fez alguna endoscopia (ex.: gastroscópia, colonoscopia, citostopia)?",
                ResponseType.boolean,
                null
            )
        ]),
        new QuestionGroup("Comportamentos de Risco", [
            new Question
            (
                "31",
                "Nos últimos 3 meses teve contacto sexual com uma nova pessoa",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "32",
                "Nos últimos 3 meses teve contacto sexual com mais do que uma pessoa",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "33",
                "Nos últimos 12 meses teve contacto sexual com uma pessoa infetada ou em tratamento para o Vírus da SIDA (VIH), Hepatite B, C ou Sífilis?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "34",
                "Alguma vez teve contactos sexuais mediante recebimento de contrapartidas financeiras ou equivalentes (dinheiro, drogas ou outras)?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "35",
                "Alguma vez consumiu drogas (injetáveis, inaláveis, ingeridas ou outras)?",
                ResponseType.boolean,
                null
            ),
            new Question
            (
                "36",
                "A pessoa com quem tem contacto sexual tem algum dos comportamentos referidos nas questões 31, 33 e 34?",
                ResponseType.boolean,
                null
            )
        ])
    ];
    
    private static readonly List<Rule> Rules = Questions
        .SelectMany(qg => qg.Questions)
        .Select(q =>
        {
            if (!q.Id.Contains('_'))
                return new Rule(
                    new LogicalCondition(
                        null,
                        []
                    ),
                    new Event(EventType.showQuestion, new EventParams(q.Id))
                );
            var parentId = q.Id.Split('_')[0];
            return new Rule(
                new LogicalCondition(
                    new List<Condition> { new EvaluationCondition(parentId, Operator.equal, "yes") },
                    null
                ),
                new Event(EventType.showQuestion, new EventParams(q.Id))
            );

        })
        .ToList();
    
    private static readonly Form realForm = new Form
    (
        Questions,
        Rules,
        FormLanguages.Pt,
        Admin
    );

    public static readonly FormEntity Form = realForm.ToEntity(null, Users[0], null);

    public static readonly InconsistencyEntity Inconsistencies = new InconsistencyEntity
    {
        Date=DateTime.UtcNow,
        Admin = Users[0],
        Reason = null,
        Rules = [],
        Form = Form
    };

    /*ion sub1 = new Submission(
        new List<AnsweredQuestion>
        {
            new AnsweredQuestion("Q2", new BooleanAnswer(true)),
            new AnsweredQuestion("Q3", new BooleanAnswer(true)),
            new AnsweredQuestion("Q4", new BooleanAnswer(false)),
            new AnsweredQuestion("Q5", new BooleanAnswer(false)),
        },
        DateTime.Now.ToUniversalTime(),
        Donor.Nic,
        1
    );
    private static readonly Submission sub2 = new Submission(
        new List<AnsweredQuestion>
        {
            new AnsweredQuestion("Q2", new BooleanAnswer(true)),
            new AnsweredQuestion("Q3", new BooleanAnswer(true)),
            new AnsweredQuestion("Q4", new BooleanAnswer(false)),
            new AnsweredQuestion("Q5", new BooleanAnswer(false)),
        },
        DateTime.Now.ToUniversalTime(),
        Donor.Nic,
        1
    );

    public static readonly List<Submission> Submissions = new List<Submission>
    {
        sub1,
        sub2
    };

    public static readonly Review rev1 = new Review(
        sub1.Id,
        Doctor.Nic,
        "approved",
        null,
        DateTime.Now.ToUniversalTime()
        );

    public static readonly Review rev2 = new Review(
        sub2.Id,
        Doctor.Nic,
        "rejected",
        null,
        DateTime.Now.ToUniversalTime()
    );

    public static readonly List<Review> Reviews = new List<Review>
    {
        rev1,
        rev2
    };*/

    public static readonly List<KeyValuePair<string, string>> CftToManualEntries =
    [
        new KeyValuePair<string, string>(
            "Derivados do ácido propiónico",
            "Anti-Inflamatórios não esteroides (AINES)"
        ),
        new KeyValuePair<string, string>(
            "Outros anticoagulantes",
            "Anticoagulantes"
        ),
        new KeyValuePair<string, string>(
            "Inibidores da bomba de protões",
            "Antiácidos, incluindo agonistas de recetores H2 e inibidores da bomba de protões"
        ),
        new KeyValuePair<string, string>(
            "Analgésicos e antipiréticos",
            "Analgésicos"
        )
    ];
}