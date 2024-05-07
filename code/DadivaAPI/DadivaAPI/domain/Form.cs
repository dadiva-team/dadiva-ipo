namespace DadivaAPI.domain;

public record Form
{
    public List<QuestionGroup> Groups { get; set; }
    public List<Rule> Rules { get; set; }
}