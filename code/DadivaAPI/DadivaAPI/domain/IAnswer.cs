namespace DadivaAPI.domain;

public interface IAnswer;

public record StringAnswer(string Content) : IAnswer;
public record BooleanAnswer(bool Content) : IAnswer;
public record StringListAnswer(List<string> Content) : IAnswer;