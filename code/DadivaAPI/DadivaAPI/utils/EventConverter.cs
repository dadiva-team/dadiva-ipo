using System.Text.Json;
using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.utils;

public class EventConverter : JsonConverter<Event>
{
    public override Event Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using (JsonDocument doc = JsonDocument.ParseValue(ref reader))
        {
            var rootElement = doc.RootElement;

            Console.Out.WriteLine("Root element: " + rootElement.ToString());
            var typeString = rootElement.GetProperty("Type").GetString();
            var type = Enum.Parse<EventType>(typeString);
            
            var id = rootElement.GetProperty("Params").GetProperty("Id").GetString();
            
            return new Event(
                Type: type,
                Params: new EventParams(
                    Id: id
                )
            );
        }
    }

    public override void Write(Utf8JsonWriter writer, Event value, JsonSerializerOptions options)
    {
        JsonSerializer.Serialize(writer, (object)value, value.GetType(), options);
    }
}