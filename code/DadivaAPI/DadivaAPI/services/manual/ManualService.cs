using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.utils;

namespace DadivaAPI.services.manual;

public class ManualService(IRepository repository) : IManualService
{
    public async Task<Result<List<ManualInformation>, Problem>> GetManualInformation(string productName)
    {
        var manualEntries = await repository.GetManualEntriesFromCfts(await repository.GetCfts(productName));
        return Result<List<ManualInformation>, Problem>.Success(await repository.GetManualInformations(manualEntries));
    }
}