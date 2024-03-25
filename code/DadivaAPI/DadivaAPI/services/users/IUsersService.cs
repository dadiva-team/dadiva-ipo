using DadivaAPI.utils;

namespace DadivaAPI.services.users;

public interface IUsersService
{
    public Task<Result<JwtTokenDTO,string>> CreateToken(int nic, string password);
    
}