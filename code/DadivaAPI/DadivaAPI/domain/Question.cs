namespace DadivaAPI.domain;

public abstract record _Question;

public record SimpleQuestion(string QuestionText) : _Question;

public enum ResponseType
{
    DROPDOWN
}

public record _SubQuestion(bool Rule, _Question Question, ResponseType ResponseType);

public record _ComplexQuestion(string QuestionText, List<SubQuestion> SubQuestions) : _Question;

public record Question(string QuestionText, List<SubQuestion>? SubQuestions = null);

public record SubQuestion(bool Rule, Question Question, ResponseType ResponseType);
