namespace DadivaAPI.repositories.medications;

public interface IMedicationsRepository
{
    public Task<List<string>> SearchMedications(string query);

    public Task<List<string>> GetCfts(string productName);
}