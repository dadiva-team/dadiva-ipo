using DadivaAPI.repositories.form;
using DadivaAPI.repositories.users;

namespace DadivaAPI.repositories;

public class Repository(DadivaDbContext context) : IRepository
{
    public IFormRepository FormRepository { get; } = new FormRepository(context);
    public IUsersRepository UserRepository { get; } = new UsersRepository(context);
}