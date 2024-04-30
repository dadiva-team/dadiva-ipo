using DadivaAPI.domain;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;

namespace DadivaAPI.repositories.form;

public class FormRepositoryES : IFormRepository
{
    private readonly ElasticsearchClient _client;

    public FormRepositoryES()
    {
        var settings = new ElasticsearchClientSettings(new Uri("http://localhost:9200"))
            .DefaultIndex("form");
        _client = new ElasticsearchClient(settings);
    }

    public async Task<Form?> GetForm()
    {
        try
        {
            var request = new SearchRequest("form");
            var searchResponse = await _client.SearchAsync<Form>(request);
            
            if (searchResponse.IsValidResponse)
            {
                return  searchResponse.Documents.First();
            }

            return null;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error getting form: '{e}'");
            return null;
        }
    }

    public async Task<bool> SubmitForm(Form form)
    {
        try
        {
            var response = await _client.IndexAsync(form, idx => idx.Index("form"));
            return response.IsValidResponse;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error submitting form: '{e}'");
            return false;
        }
    }
}