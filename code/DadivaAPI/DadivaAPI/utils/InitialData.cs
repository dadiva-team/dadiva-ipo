using DadivaAPI.domain;

namespace DadivaAPI.utils;

public class InitialData
{
    static readonly User Admin = new User
    (
        987654321,
        "Eng. Doe",
        "MegaPassword123!hashed",
        Role.admin
    );

    static readonly User Doctor = new User
    (
        111111111,
        "Dr. Doe",
        "MegaPassword123!hashed",
        Role.doctor
    );

    static readonly User Donor = new User
    (
        123456789,
        "John Doe",
        "MegaPassword123!hashed",
        Role.donor
    );

    public static readonly List<User> Users =
    [
        Admin,
        Doctor,
        Donor
    ];

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
    ];

    public static readonly Form Form = new Form
    (
        [
            new QuestionGroup("Dádivas Anteriores", [
                new Question
                (
                    "q2",
                    "Quais os medicamentos que toma?",
                    ResponseType.medications,
                    null
                )
            ]),
            new QuestionGroup("Dádivas Anteriores 2", [
                new Question(
                    "q3",
                    "Alguma vez deu sangue ou componentes sanguíneos?",
                    ResponseType.boolean,
                    null
                )
            ])
        ],
        [
            new Rule(new LogicalCondition([], []), new Event(EventType.showQuestion, new EventParams("q2"))),
            new Rule(new LogicalCondition([new EvaluationCondition("q2", Operator.notEqual, "")], []), new Event(EventType.nextGroup, null)),
            new Rule(new LogicalCondition([], []), new Event(EventType.showQuestion, new EventParams("q3"))),
            new Rule(new LogicalCondition([new EvaluationCondition("q3", Operator.notEqual, "")], []), new Event(EventType.showReview, null))
        ],
        Admin,
        DateTime.Now.ToUniversalTime()
    );
    
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