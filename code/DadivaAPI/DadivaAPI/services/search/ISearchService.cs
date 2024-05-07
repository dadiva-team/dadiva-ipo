using DadivaAPI.utils;

namespace DadivaAPI.services.dnd;

public interface ISearchService
{
    public Task<Result<string[], Problem>> GetDnD();

}