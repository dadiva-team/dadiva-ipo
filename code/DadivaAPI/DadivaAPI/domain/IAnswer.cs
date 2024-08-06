namespace DadivaAPI.domain;

public interface IAnswer
{
    bool ValidateAnswer();
}

public record StringAnswer(string Content) : IAnswer
{
    public bool ValidateAnswer()
    {
        return Content.Length > 0;
    }
}

public record BooleanAnswer(bool Content) : IAnswer
{
    public bool ValidateAnswer()
    {
        return true;
    }
}

public record StringListAnswer(List<string> Content) : IAnswer
{
    public bool ValidateAnswer()
    {
        return Content.All(s => s.Length > 0);
    }
}