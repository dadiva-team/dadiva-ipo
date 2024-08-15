using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record EditFormRequest(
    string Language,
    List<QuestionGroupModel> Groups,
    List<RuleModel> Rules,
    string? Reason
    );