using DadivaAPI.repositories.form;
using DadivaAPI.repositories.terms;
using DadivaAPI.repositories.users;
using Elastic.Clients.Elasticsearch;

namespace DadivaAPI.repositories;

public class Repository(DadivaDbContext context, ElasticsearchClient client) : IRepository
{
    public IFormRepository FormRepository { get; } = new FormRepository(context);
    public IUsersRepository UserRepository { get; } = new UsersRepository(context);
    public ITermsRepository TermsRepository { get; } = new TermsRepository(client);
}