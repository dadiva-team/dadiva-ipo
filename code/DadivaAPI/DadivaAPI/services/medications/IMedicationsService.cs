using DadivaAPI.domain;
using DadivaAPI.utils;

namespace DadivaAPI.services.interactions;

public interface IMedicationsService
{
    Task<Result<List<string>, Problem>> SearchMedications(string query);
}