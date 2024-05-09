using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record EditFormRequest(List<QuestionGroupModel> Groups, List<RuleModel> Rules);