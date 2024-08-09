using DadivaAPI.repositories.Entities;

namespace DadivaAPI.repositories.form;

public interface IFormRepository
{
    public Task<FormEntity?> GetForm(string language);
    public Task<bool> AddForm(FormEntity form);
    public Task<InconsistencyEntity?> GetInconsistencies();
    public Task<bool> EditInconsistencies(InconsistencyEntity inconsistencies);
}