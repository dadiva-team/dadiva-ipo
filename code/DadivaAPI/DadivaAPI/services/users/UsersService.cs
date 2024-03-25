using DadivaAPI.repositories.users;

namespace DadivaAPI.services.users;

public class UsersService(IUsersRepository repository) : IUsersService
{
    public ResultJwtTokenDTO CreateToken(int nic, string password)
    {
        User? user = repository.GetUserByNicAndPassword(nic, password);
        if (user == null)
        {
            return 
        }
    }
    
    
}