using System.Text.Json.Serialization;
using DadivaAPI.domain;

namespace DadivaAPI.routes.form.models
{
    public class Event
    {
        [JsonPropertyName("type")]
        public EventType Type { get; set; }

        [JsonPropertyName("params")]
        public EventParams Params { get; set; }
        
        public Event(DadivaAPI.domain.Event evt)
        {
            Type = evt.Type;
            Params = new EventParams(evt.Params);
        }
    }

    public class EventParams
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        public EventParams(DadivaAPI.domain.EventParams eventParams)
        {
            Id = eventParams.Id;
        }
    }
}