using System.Text.Json;
using DadivaAPI.domain;
using Newtonsoft.Json;

namespace DadivaAPI.routes.form.models;

public record AnsweredQuestionModel(string QuestionId, JsonElement Answer)
{
    public static AnsweredQuestionModel FromDomain(AnsweredQuestion answeredQuestion)
    {
        string json = JsonConvert.SerializeObject(answeredQuestion.Answer);
        using var jsonDoc = JsonDocument.Parse(json);
        JsonElement element = jsonDoc.RootElement.GetProperty("Content").Clone();
        return new AnsweredQuestionModel(answeredQuestion.QuestionId, element);
    }
};