using System.Security.Cryptography;
using DadivaAPI.domain;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;

namespace DadivaAPI.repositories.users;

public class UsersRepositoryES : IUsersRepository
{
    private readonly ElasticsearchClient _client;

    public UsersRepositoryES()
    {
        var settings = new ElasticsearchClientSettings(new Uri("http://localhost:9200"))
            .DefaultIndex("users");
        _client = new ElasticsearchClient(settings);
    }

    public async Task<bool> CheckUserByNicAndPassword(int nic, string hashedPassword)
    {
        var request = new SearchRequest("users")
        {
            Query = new TermQuery("nic") {Value=nic},
        };
        var searchResponse = await _client.SearchAsync<User>(request);

        if (searchResponse.IsValidResponse && searchResponse.Documents.First().password==hashedPassword)
        {
            return true;
        }

        return false;
    }

    public async Task<bool> AddUser(int nic, string hashedPassword)
    {
        var user = new User
        {
            nic=nic,
            password=hashedPassword
        };
        try
        {
            if (await CheckUserByNicAndPassword(nic, hashedPassword)) throw new Exception("User already exists");
            var response = await _client.IndexAsync(user, idx => idx.Index("users"));
            return response.IsValidResponse;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Repository Exception while creating user: '{e}'");
            return false;
        }
    }
}