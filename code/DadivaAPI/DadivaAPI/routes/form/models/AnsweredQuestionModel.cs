using System.Text.Json.Serialization;
using DadivaAPI.domain;
using DadivaAPI.repositories.Entities;
using DadivaAPI.utils;


namespace DadivaAPI.routes.form.models;

public class AnsweredQuestionModel
{
    [JsonPropertyName("questionId")]
    public string QuestionId { get; set; }

    [JsonPropertyName("answer")]
    [JsonConverter(typeof(AnswerConverter))]
    public IAnswer Answer { get; set; }


    public AnsweredQuestionModel(string questionId, IAnswer answer)
    {
        QuestionId = questionId;
        Answer = answer;
    }

    public static AnsweredQuestionModel FromDomain(AnsweredQuestion domain)
    {
        return new AnsweredQuestionModel(domain.Question.Id, domain.Answer);
    }

    public AnsweredQuestion ToDomain(AnsweredQuestionModel model, FormEntity form)
    {
        Console.WriteLine($"Converting QuestionId: {model.QuestionId}");

        if (form.QuestionGroups == null || !form.QuestionGroups.Any())
        {
            throw new Exception("FormEntity contains no QuestionGroups.");
        }

        var question = form.QuestionGroups.SelectMany(g => g.Questions)
            .FirstOrDefault(q => q.OriginalId == model.QuestionId);

        if (question == null)
        {
            throw new KeyNotFoundException($"Question with ID {model.QuestionId} not found in the form.");
        }

        return new AnsweredQuestion(question.ToDomain(), model.Answer, null);
    }
}