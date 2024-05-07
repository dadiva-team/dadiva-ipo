namespace DadivaAPI.repositories.dnd;

public class SearchRepositoryMemory : ISearchRepository
{
    private readonly string[] _dnd = [
        "paracetamol",
        "aspirina",
        "pilula",
        "metibasol",
        "osteoporose",
        "cataratas",
        "constipação"
    ];
    
    public Task<string[]> GetDnd()
    {
        return Task.FromResult(_dnd);
    }
}