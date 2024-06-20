using DadivaAPI.domain;

namespace DadivaAPI.repositories.form;

public class MockForm
{
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
        new User(111111111, "Dr. Doe", "MegaPassword123!", Role.doctor),
        DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc)
    );
}