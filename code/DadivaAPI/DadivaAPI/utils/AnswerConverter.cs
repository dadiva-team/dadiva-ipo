using System.Text.Json;
using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.utils;

public class AnswerConverter : JsonConverter<IAnswer>
{
    public override IAnswer Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument doc = JsonDocument.ParseValue(ref reader);
        JsonElement rootElement = doc.RootElement;

        return rootElement.ValueKind switch
        {
            JsonValueKind.String => new StringAnswer(rootElement.GetString()),
            JsonValueKind.True or JsonValueKind.False => new BooleanAnswer(rootElement.GetBoolean()),
            JsonValueKind.Array => new StringListAnswer(rootElement.EnumerateArray().Select(e => e.GetString()).ToList()),
            JsonValueKind.Null or JsonValueKind.Undefined => new StringAnswer("No answer"),
            _ => throw new JsonException("Unsupported answer type.")
        };
    }

    public override void Write(Utf8JsonWriter writer, IAnswer value, JsonSerializerOptions options)
    {
        Console.WriteLine($"Serializing: {value.GetType().Name} with value: {value}");
        switch (value)
        {
            case StringAnswer stringAnswer:
                JsonSerializer.Serialize(writer, stringAnswer.Content, options);
                break;

            case BooleanAnswer booleanAnswer:
                JsonSerializer.Serialize(writer, booleanAnswer.Content, options);
                break;

            case StringListAnswer stringListAnswer:
                JsonSerializer.Serialize(writer, stringListAnswer.Content, options);
                break;

            default:
                throw new JsonException($"Unsupported answer type: {value.GetType().Name}");
        }
    }

}




