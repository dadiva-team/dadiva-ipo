using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record EditInconsistenciesRequest(List<RuleModel> Inconsistencies);