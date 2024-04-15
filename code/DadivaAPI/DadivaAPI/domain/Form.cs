namespace DadivaAPI.domain;

public record Form
{
    public List<Question> Questions { get; set; }
    public List<Rule> Rules { get; set; }
}