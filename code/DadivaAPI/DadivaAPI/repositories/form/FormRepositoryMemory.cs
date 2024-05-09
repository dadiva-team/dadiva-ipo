using DadivaAPI.domain;

namespace DadivaAPI.repositories.form;

public class FormRepositoryMemory : IFormRepository
{
    private Dictionary<int, Submission> submissions = new();
    
    private Form form = new Form
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
                    { ConditionType.any, new List<Evaluation>{} }
                }!
                ,
                new Event
                (
                    EventType.showQuestion,
                    new EventParams("hasTraveled")
                )
            )
            ,
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
    );

    public Task<Form> GetForm()
    {
        return Task.FromResult(form);
    }

    public Task<Form> EditForm(Form form)
    {
        return Task.FromResult(form);
    }

    public async Task<bool> SubmitForm(Submission submission, int nic)
    {
        submissions.Add(nic, submission);
        return true;
    }

    public async Task<Dictionary<int, Submission>> GetSubmissions()
    {
        return submissions;
    }
}