using DadivaAPI.domain;

namespace DadivaAPI.repositories.manual;

public interface IManualRepository
{
    Task<List<ManualInformation>> GetManualInformations(List<string> manualEntries);
}