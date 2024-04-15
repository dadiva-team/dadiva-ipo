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
                ResponseType.BOOLEAN,
                null
            ),
            new
            (
                "traveledWhere",
                "Para onde?",
                ResponseType.TEXT,
                null
            )
        },
        Rules = new List<Rule>
        {
            new(
    
                
                new Dictionary<ConditionType, List<Evaluation>?>
                {
                    { ConditionType.any, new List<Evaluation>() }
                }!
                ,
                new Event(
                    EventType.showQuestion,
                    new List<EventParams>
                    {
                        new("hasTraveled")
                    })
            ),
            new(
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
                new Event(
                    EventType.showQuestion,
                    new List<EventParams>
                    {
                        new("traveledWhere")
                    })
            )
        }
    };

    public Task<Form> GetForm()
    {
        return Task.FromResult(form);
    }
}