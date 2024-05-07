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

    public async Task<Form> SubmitForm(Form form)
    {
        try
        {
            var response = await client.IndexAsync(form, idx => idx.Index("form"));
            return form;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error submitting form: '{e}'");
            return form; //TODO: better error handling
        }
    }
}