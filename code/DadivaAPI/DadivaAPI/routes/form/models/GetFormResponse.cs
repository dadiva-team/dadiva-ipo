using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models
{
    public record GetFormResponse(
        List<Question> Questions,
        List<Rule> Rules
    );
}