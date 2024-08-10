using DadivaAPI.repositories;
using DadivaAPI.utils;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.services.medications;

public class MedicationsService(IRepository repository, DbContext context) : IMedicationsService
{
    public async Task<Result<List<string>>> SearchMedications(string query)
    {
        return await context.WithTransaction(async () =>
        {
            List<string> list = await repository.SearchMedications(query);
            return Result.Ok(list);
        });
        
    }
}