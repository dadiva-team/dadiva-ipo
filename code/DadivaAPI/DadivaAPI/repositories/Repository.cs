using DadivaAPI.repositories.cftToManual;
using DadivaAPI.repositories.form;
using DadivaAPI.repositories.manual;
using DadivaAPI.repositories.medications;
using DadivaAPI.repositories.terms;
using DadivaAPI.repositories.users;
using Elastic.Clients.Elasticsearch;

namespace DadivaAPI.repositories;

public class Repository(DadivaDbContext context, ElasticsearchClient client) : IRepository
{
    public IFormRepository FormRepository { get; } = new FormRepository(context);
    public IUsersRepository UserRepository { get; } = new UsersRepository(context);
    public ITermsRepository TermsRepository { get; } = new TermsRepository(client);
    public IMedicationsRepository MedicationRepository { get; } = new MedicationsRepository();
    
    public ICftToManualRepository CftToManualRepository { get; } = new CftToManualRepository(context);
    
    public IManualRepository ManualRepository { get; } = new ManualRepository(client);
}