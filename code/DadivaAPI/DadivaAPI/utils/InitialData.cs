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
                    "Sente-se bem de saúde e em condições de dar sangue?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "q3",
                    "Alguma vez deu sangue ou componentes sanguíneos?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "q4",
                    "Deu sangue há menos de 2 meses?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "q5",
                    "Alguma vez lhe foi aplicada uma suspensão para a dádiva de sangue?",
                    ResponseType.boolean,
                    null
                ),
                new Question
                (
                    "q6",
                    "Ocorreu alguma reação ou incidente nas dádivas anteriores?",
                    ResponseType.boolean,
                    null
                )
            ]),
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
                )
            ])
        ],
        [],
        Admin,
        DateTime.Now.ToUniversalTime()
    );
}