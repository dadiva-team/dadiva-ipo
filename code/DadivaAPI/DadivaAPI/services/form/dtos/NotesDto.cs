using Elastic.Clients.Elasticsearch;

namespace DadivaAPI.services.form.dtos;

public class NoteDto    
{
    public string Id { get; set; }
    public string? Note { get; set; }
}

public class NotesDto
{
    public List<NoteDto> Notes { get; set; } = new List<NoteDto>();
}