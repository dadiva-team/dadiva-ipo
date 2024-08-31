using DadivaAPI.repositories.Entities;
using DadivaAPI.services.submissions.dtos;

namespace DadivaAPI.repositories.form;

public interface IFormRepository
{
    public Task<FormEntity?> GetForm(string language);
    
    public Task<FormEntity?> GetFormWithId(int formId);
    public Task<bool> AddForm(FormEntity form);
    public Task<MinimalInconsistencyDto?> GetInconsistencies(int? formId = null);
    public Task<bool> EditInconsistencies(InconsistencyEntity inconsistencies);
}