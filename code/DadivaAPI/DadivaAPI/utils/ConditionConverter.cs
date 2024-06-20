using System.Text.Json;
using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.utils;

public class ConditionConverter : JsonConverter<Condition>
{
    public override Condition Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using (JsonDocument doc = JsonDocument.ParseValue(ref reader))
        {
            var rootElement = doc.RootElement;

            // Handle nested logical conditions and evaluation conditions
            if (rootElement.TryGetProperty("fact", out _) || rootElement.TryGetProperty("Fact", out _))
            {
                Console.Out.WriteLine("Root element: " + rootElement.ToString());
                return JsonSerializer.Deserialize<EvaluationCondition>(rootElement.GetRawText(), options);
            }

            if (rootElement.TryGetProperty("all", out _) || rootElement.TryGetProperty("All", out _) ||
                rootElement.TryGetProperty("any", out _) || rootElement.TryGetProperty("Any", out _))
            {
                return JsonSerializer.Deserialize<LogicalCondition>(rootElement.GetRawText(), options);
            }

            // Log the unknown JSON structure for debugging purposes
            var json = rootElement.GetRawText();
            Console.WriteLine($"Unknown type of ConditionModel: {json}");

            throw new JsonException("Unknown type of ConditionModel.");
        }
    }

    public override void Write(Utf8JsonWriter writer, Condition value, JsonSerializerOptions options)
    {
        JsonSerializer.Serialize(writer, (object)value, value.GetType(), options);
    }
}