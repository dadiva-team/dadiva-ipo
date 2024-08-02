using DadivaAPI.repositories.Entities;
using DadivaAPI.repositories.form;
using DadivaAPI.repositories.manual;
using DadivaAPI.repositories.medications;
using DadivaAPI.repositories.terms;
using DadivaAPI.repositories.users;

namespace DadivaAPI.repositories;

public interface IRepository
{
    public IFormRepository FormRepository { get; }
    public IUsersRepository UserRepository { get; }
    public ITermsRepository TermsRepository { get; }

    public IMedicationsRepository MedicationRepository { get; }
    public IManualRepository ManualRepository { get; }
    
    public Task<UserEntity?> GetUserByNic(string nic);
    public Task<bool> AddUser(UserEntity user);
    public Task<bool> UpdateUser(UserEntity user);
    
    public Task<List<UserEntity>> GetUsers();
    
    public Task<bool> DeleteUser(string nic);

    public Task<bool> AddSuspension(SuspensionEntity suspension);
    public Task<bool> UpdateSuspension(SuspensionEntity suspension);
    public Task<SuspensionEntity?> GetSuspension(string userNic);
    public Task<bool> DeleteSuspension(string userNic);

    public Task<FormEntity?> GetForm();

    public Task<TermsEntity?> GetActiveTerms(string language);
    public Task<List<TermsEntity>?> GetTermsHistory(string language);
    public Task<TermsEntity?> GetTermsById(int id);
    public Task<bool> SubmitTerms(string content, string language, string? reason);
    
}