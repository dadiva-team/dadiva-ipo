using DadivaAPI.utils;

namespace DadivaAPI.services.dnd;

public interface IDnDService
{
    public Task<Result<string[], Problem>> GetDnD();

}