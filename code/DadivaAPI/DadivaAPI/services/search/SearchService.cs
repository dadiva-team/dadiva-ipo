using DadivaAPI.repositories.dnd;
using DadivaAPI.utils;

namespace DadivaAPI.services.dnd;

public class SearchService(ISearchRepository repository):ISearchService
{
    public async Task<Result<string[], Problem>> GetDnD()
    {
        string[] dnd = await repository.GetDnd();
        return Result<string[], Problem>.Success(dnd);
    }
}