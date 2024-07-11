using DadivaAPI.domain;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;
using Microsoft.IdentityModel.Tokens;

namespace DadivaAPI.repositories.manual;

public class ManualRepository(ElasticsearchClient client) : IManualRepository
{
    private const string ManualIndex = "manual";

    public async Task<List<ManualInformation>> GetManualInformations(List<string> manualEntries)
    {
        var termsQueryField = new TermsQueryField(manualEntries.Select(FieldValue.String).ToList());


        var response = await client.SearchAsync<ManualInformation>(
            idx =>
                idx
                    .Index(ManualIndex)
                    .Query(new TermsQuery
                    {
                        Field = "groupName.keyword",
                        Terms = termsQueryField
                    })
        );

        if (!response.IsValidResponse)
        {
            throw new Exception("Search query failed", response.ApiCallDetails.OriginalException);
        }

        Console.Out.WriteLine("GetManualInformations response:");
        if (response.Documents.IsNullOrEmpty()) Console.Out.WriteLine("No response entries found");
        foreach (var document in response.Documents)
        {
            Console.Out.WriteLine(document);
        }
        
        return response.Documents.ToList();
    }
}