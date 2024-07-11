using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.utils;
using Microsoft.IdentityModel.Tokens;

namespace DadivaAPI.services.manual;

public class ManualService(IRepository repository) : IManualService
{
    public async Task<Result<List<ManualInformation>, Problem>> GetManualInformation(string productName)
    {
        Console.Out.WriteLine("Service.GetManualInformation product: " + productName);
        var manualEntries = await repository.GetManualEntriesFromCfts(await repository.GetCfts(productName));
        Console.Out.WriteLine("Service.GetManualInformation manualEntries: ");
        if(manualEntries.IsNullOrEmpty()) Console.Out.WriteLine("No manual entries found");
        foreach (var manualEntry in manualEntries)
        {
            Console.Out.WriteLine(manualEntry);
        }
        return Result<List<ManualInformation>, Problem>.Success(await repository.GetManualInformations(manualEntries));
    }
}