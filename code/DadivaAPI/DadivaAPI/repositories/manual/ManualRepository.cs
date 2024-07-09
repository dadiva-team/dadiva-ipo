using DadivaAPI.domain;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;

namespace DadivaAPI.repositories.manual;

public class ManualRepository(ElasticsearchClient client) : IManualRepository
{
    private const string ManualIndex = "manual";

    public async Task<List<ManualInformation>> GetManualInformations(List<string> manualEntries)
    {
        var queries = manualEntries.Select(fieldName => new ExistsQuery { Field = fieldName })
            .Select(dummy => (Query)dummy).ToList();


        var response = await client.SearchAsync<ManualInformation>(
            idx =>
                idx
                    .Index(ManualIndex)
                    .Query(new BoolQuery
                    {
                        Must = queries
                    })
        );

        if (!response.IsValidResponse)
        {
            throw new Exception("Search query failed", response.ApiCallDetails.OriginalException);
        }

        return response.Documents.ToList();
    }
}