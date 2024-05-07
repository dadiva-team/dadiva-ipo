namespace DadivaAPI.repositories.dnd;

public interface ISearchRepository
{
    public Task<string[]> GetDnd();
}