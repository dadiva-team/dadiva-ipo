using System.Text.Json;
using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.utils;

public class AnswerConverter : JsonConverter<IAnswer>
{
    public override IAnswer Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using JsonDocument doc = JsonDocument.ParseValue(ref reader);
        Console.Out.WriteLine(doc.RootElement);
        JsonElement element = doc.RootElement.GetProperty("Content");


        Console.Out.WriteLine("Element: " + element);
        return element.ValueKind switch
        {
            JsonValueKind.String => new StringAnswer(element.GetString()),
            JsonValueKind.True or JsonValueKind.False => new BooleanAnswer(element.GetBoolean()),
            JsonValueKind.Array => new StringListAnswer(element.EnumerateArray().Select(e => e.GetString()).ToList()),
            _ => throw new Exception("Invalid answer type")
        };
    }

    public override void Write(Utf8JsonWriter writer, IAnswer value, JsonSerializerOptions options)
    {
        JsonSerializer.Serialize(writer, (object)value, value.GetType(), options);
    }
}