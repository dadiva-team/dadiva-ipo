namespace DadivaAPI.repositories.cftToManual;

public interface ICftToManualRepository
{
    Task<string> GetManualEntryFromCft(string cft);
    public Task<bool> AddCftToManualEntry(string cft, string manualEntry);
    
    public Task<List<string>> GetManualEntriesFromCfts(List<string> cfts);
}