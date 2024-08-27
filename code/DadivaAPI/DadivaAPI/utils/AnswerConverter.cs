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
            JsonValueKind.String => DetectAndConvertString(rootElement.GetString()),
            JsonValueKind.True or JsonValueKind.False => new BooleanAnswer(rootElement.GetBoolean()),
            JsonValueKind.Array => new StringListAnswer(rootElement.EnumerateArray().Select(e => e.GetString()).ToList()),
            JsonValueKind.Null or JsonValueKind.Undefined => new StringAnswer("No answer"),
            _ => throw new JsonException("Unsupported answer type.")
        };
    }

    private IAnswer DetectAndConvertString(string answer)
    {
        if (bool.TryParse(answer, out bool boolResult))
        {
            return new BooleanAnswer(boolResult);
        }

        return new StringAnswer(answer);
    }

    public override void Write(Utf8JsonWriter writer, IAnswer value, JsonSerializerOptions options)
    {
        JsonSerializer.Serialize(writer, (object)value, value.GetType(), options);
    }
}




