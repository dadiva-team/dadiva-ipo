using DadivaAPI.domain;
using DadivaAPI.repositories.Entities;

namespace DadivaAPI.repositories.manual;

public interface IManualRepository
{
    Task<List<ManualEntryEntity>> GetManualEntries(List<string> cfts);
    
    //TODO: Add Cft methods
}