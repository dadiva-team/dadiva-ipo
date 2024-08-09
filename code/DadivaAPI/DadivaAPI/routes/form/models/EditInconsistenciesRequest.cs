using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models;

public record EditInconsistenciesRequest(
    List<RuleModel> Inconsistencies,
    string Nic,
    string Language,
    string? Reason
    );