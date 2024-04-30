using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record SubmitFormRequest
{
    public List<QuestionModel> Questions { get; set; }
    public  List<RuleModel> Rules { get; set; }
};