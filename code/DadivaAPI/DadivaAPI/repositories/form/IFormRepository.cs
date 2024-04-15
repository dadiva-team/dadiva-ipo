using DadivaAPI.domain;

namespace DadivaAPI.repositories.form;

public interface IFormRepository
{
    public Task<Form> GetForm();
}