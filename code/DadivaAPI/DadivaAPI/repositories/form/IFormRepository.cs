using DadivaAPI.domain;

namespace DadivaAPI.repositories.form;

public interface IFormRepository
{
    public Task<Form?> GetForm();
    
    public Task<Form> EditForm(Form form);
    
    public Task<bool> SubmitForm(Submission submission, int nic);
    
    public Task<Dictionary<int, Submission>> GetSubmissions();
}