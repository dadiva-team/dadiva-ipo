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

            EventParams? eventParams = null;           
            
            if(rootElement.TryGetProperty("Params", out var paramsElement))
             eventParams = new EventParams(paramsElement.GetProperty("Id").GetString());
            
            return new Event(
                Type: type,
                Params: eventParams
            );
        }
    }

    public override void Write(Utf8JsonWriter writer, Event value, JsonSerializerOptions options)
    {
        writer.WriteStartObject();
        
        writer.WriteString("Type", value.Type.ToString());
        
        if (value?.Params != null)
        {
            writer.WritePropertyName("Params");
            writer.WriteStartObject();
            writer.WriteString("Id", value.Params.Id);
            writer.WriteEndObject();
        }

        writer.WriteEndObject();
    }
}