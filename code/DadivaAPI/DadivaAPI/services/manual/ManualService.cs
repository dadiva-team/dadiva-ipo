using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.utils;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.services.manual;

public class ManualService(IRepository repository, DadivaDbContext context) : IManualService
{
    public async Task<Result<List<ManualEntry>>> GetManualInformation(string productName)
    {
        return await context.WithTransaction(async () =>
        {
            var manualEntries = await repository.GetManualEntries(await repository.GetCfts(productName));
            return Result.Ok(manualEntries.Select(me => me.ToDomain()).ToList());
        });
    }
}