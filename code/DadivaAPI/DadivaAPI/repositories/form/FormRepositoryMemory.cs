using DadivaAPI.domain;

namespace DadivaAPI.repositories.form;

public class FormRepositoryMemory : IFormRepository
{
    private readonly Form form = new()
    {
        Questions = new List<Question>
        {
            new
            (
                "hasTraveled",
                "Ja viajou para fora de Portugal?",
                ResponseType.Boolean,
                null
            ),
            new
            (
                "traveledWhere",
                "Para onde?",
                ResponseType.Text,
                null
            )
        },
        Rules = new List<Rule>
        {
            new Rule 
            {
                Conditions = new Dictionary<ConditionType, List<Evaluation>?>
                {
                    { ConditionType.any, new List<Evaluation>{} }
                }!
                ,
                Event = new Event
                {
                    Type = EventType.showQuestion,
                    Params = new EventParams("hasTraveled")
                }
            }
            ,
            new Rule
            {
                Conditions = new Dictionary<ConditionType, List<Evaluation>?>
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
                Event = new Event
                {
                    Type = EventType.showQuestion,
                    Params = new EventParams("traveledWhere")
                }
            }
        }
    };

    public Task<Form> GetForm()
    {
        return Task.FromResult(form);
    }

    public Task<bool> SubmitForm(Form form)
    {
        throw new NotImplementedException();
    }
}