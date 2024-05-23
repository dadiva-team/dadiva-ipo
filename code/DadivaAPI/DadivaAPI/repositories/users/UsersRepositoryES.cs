using DadivaAPI.domain;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.Nodes;
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

    public async Task<bool> AddUser(User user)
    {
        var response = await client.IndexAsync(
            user,
            idx => idx.Index(_index).Id(user.nic)
            );
        return response.IsValidResponse;
    }

    public async Task<List<User>?> GetUsers()
    {
        var response = await client.SearchAsync<User>(new SearchRequest(_index));
        if (response.IsValidResponse)
        {
            var users = response.Documents.ToList();
            return users;
        }
        return null;
    }

    public async Task<User?> GetUserByNic(int nic)
    {
        var response = await client.GetAsync<User>(nic, idx => idx.Index(_index));
        return response.IsValidResponse ? response.Source : null;
    }
    
    public async Task<Boolean> DeleteUser(int nic)
    {
        var response = await client.DeleteAsync(_index, nic);
        return response.IsValidResponse;
    }
}