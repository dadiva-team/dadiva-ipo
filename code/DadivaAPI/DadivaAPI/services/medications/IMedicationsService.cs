using FluentResults;

namespace DadivaAPI.services.medications;

public interface IMedicationsService
{
    Task<Result<List<string>>> SearchMedications(string query);
}