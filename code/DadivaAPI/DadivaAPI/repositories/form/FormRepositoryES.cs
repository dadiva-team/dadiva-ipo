using DadivaAPI.domain;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;

namespace DadivaAPI.repositories.form;

public class FormRepositoryES(ElasticsearchClient client) : IFormRepository
{
    private readonly string index = "form";

    public async Task<Form?> GetForm()
    {
        try
        {
            var request = new SearchRequest("form");
            var searchResponse = await client.SearchAsync<Form>(request);

            if (searchResponse.IsValidResponse)
            {
                return searchResponse.Documents.Last();
            }

            return null;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error getting form: '{e}'");
            return null;
        }
    }

    public async Task<Form> EditForm(Form form)
    {
        try
        {
            var response = await client.IndexAsync(form, idx => idx.Index("form"));
            if(!response.IsValidResponse) throw new Exception("Error editing form");
            return form;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error submitting form: '{e}'");
            return form; //TODO: better error handling
        }
    }

    public async Task<bool> SubmitForm(Submission submission, int nic)
    {
        var response = await client.IndexAsync(submission, idx => idx.Index("submissions").Id(nic));
        return response.IsValidResponse;
    }

    public async Task<Dictionary<int, Submission>> GetSubmissions()
    {
        var response = client.SearchAsync<Submission>("submissions");
        foreach (var resultHit in response.Result.Hits)
        {
            Console.Out.WriteLine("Hit: " + resultHit.Id);
            Console.Out.WriteLine("Source: " + resultHit.Source);
        }
        return response.Result.Hits.ToDictionary(h => int.Parse(h.Id), h => h.Source)!;
    }
}