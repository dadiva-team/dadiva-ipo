namespace DadivaAPI.domain;

public record Form(List<QuestionGroup> Groups, List<Rule> Rules, user.User AddedBy, DateTime AddedOn)
{
    public int Id { get; init; }
};