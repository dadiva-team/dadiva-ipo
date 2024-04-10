using DadivaAPI.domain;

namespace DadivaAPI.repositories.form;

public class FormRepositoryMemory : IFormRepository
{
    private readonly List<Question> questions = new()
    {
        new Question(
            "Tomou ou está a tomar medicamentos?",
            new()
            {
                new SubQuestion(true, new Question("Por favor indique qual a medicação:"), ResponseType.DROPDOWN),
            }),
        new Question(
            "Alguma vez viajou para forma do pais?",
            new()
            {
                new SubQuestion(true, new Question("Para que continente?"), ResponseType.DROPDOWN),
            }),
        new Question("Tem sido sempre saudavel?")
    };

    public Task<List<Question>> GetQuestions()
    {
        return Task.FromResult(questions);
    }
}