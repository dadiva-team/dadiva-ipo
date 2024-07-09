using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.utils;

namespace DadivaAPI.services.interactions;

public class MedicationsService(IRepository repository) : IMedicationsService
{
    public async Task<Result<List<string>, Problem>> SearchMedications(string query)
    {
        List<string> list = await repository.SearchMedications(query);
        return Result<List<string>, Problem>.Success(list);
    }
}