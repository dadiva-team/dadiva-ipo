using System.Security.Cryptography;
using DadivaAPI.domain;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;

namespace DadivaAPI.repositories.users;

public class UsersRepositoryES(ElasticsearchClient client) : IUsersRepository
{
    private readonly string _index = "users";


    public async Task<bool> CheckUserByNicAndPassword(int nic, string hashedPassword)
    {
        var request = new SearchRequest(_index)
        {
            Query = new TermQuery("nic") { Value = nic },
        };
        var searchResponse = await client.SearchAsync<User>(request);

        if (searchResponse.IsValidResponse && searchResponse.Documents.First().password == hashedPassword)
        {
            return true;
        }

        return false;
    }

    public async Task<bool> AddUser(int nic, string hashedPassword)
    {
        try
        {
            var response = await client.IndexAsync(hashedPassword, idx => idx.Index(_index));
            return response.IsValidResponse;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Repository Exception while creating user: '{e}'");
            return false;
        }
    }

    public async Task<List<User>> GetUsers()
    {
        try
        {
            var response = await client.SearchAsync<List<User>>(new SearchRequest(_index));
            if (response.IsValidResponse) return (List<User>)response.Documents;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Repository Exception while getting users: '{e}'");
        }

        return [];
    }

    public async Task<User?> GetUserByNic(string nic)
    {
        var response = await client.GetAsync<User>(nic, idx => idx.Index(_index));
        return response.IsValidResponse ? response.Source : null;
    }
}