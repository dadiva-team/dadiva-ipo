namespace DadivaAPI.repositories.dnd;

public interface IDnDRepository
{
    public Task<string[]> GetDnd();
}