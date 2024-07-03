using System.Text.Json;
using DadivaAPI.domain;
using Elastic.Clients.Elasticsearch;

namespace DadivaAPI.repositories.terms;

public class TermsRepository(ElasticsearchClient client) : ITermsRepository
{
    private const string TermsIndex = "terms";
    

    public async Task<Terms?> GetTerms()
    {
        Console.WriteLine("GetTerms");
        var response = await client.SearchAsync<Terms>(idx => idx.Index(TermsIndex));
        Console.WriteLine("response" + response.IsValidResponse);
        return response.IsValidResponse ? response.Documents.Last() : null;
    }

    public async Task<bool> SubmitTerms(JsonElement terms)
    {
        Console.WriteLine(client.ElasticsearchClientSettings);
        Console.WriteLine("SubmitTerms");
        Console.WriteLine(terms);
        var response = await client.IndexAsync(terms, idx => idx.Index(TermsIndex));
        return response.IsValidResponse;
    }
}