using DadivaAPI.repositories.Entities;
using DadivaAPI.repositories.form;
using DadivaAPI.repositories.manual;
using DadivaAPI.repositories.medications;
using DadivaAPI.repositories.terms;
using DadivaAPI.repositories.users;

namespace DadivaAPI.repositories;

public class Repository(DadivaDbContext context) : IRepository
{
    public IFormRepository FormRepository { get; } = new FormRepository(context);
    public IUsersRepository UserRepository { get; } = new UsersRepository(context);
    public ITermsRepository TermsRepository { get; } = new TermsRepository(context);
    public IMedicationsRepository MedicationRepository { get; } = new MedicationsRepository();
    public IManualRepository ManualRepository { get; } = new ManualRepository(context);

    public Task<UserEntity?> GetUserByNic(string nic)
    {
        return UserRepository.GetUserByNic(nic);
    }

    public Task<bool> AddUser(UserEntity user)
    {
        return UserRepository.AddUser(user);
    }

    public Task<bool> UpdateUser(UserEntity user)
    {
        return UserRepository.UpdateUser(user);
    }
    
    public Task<List<UserEntity>> GetUsers()
    {
        return UserRepository.GetUsers();
    }

    public Task<bool> DeleteUser(string nic)
    {
        return UserRepository.DeleteUser(nic);
    }

    public Task<bool> AddSuspension(SuspensionEntity suspension)
    {
        return UserRepository.AddSuspension(suspension);
    }
    public Task<bool> UpdateSuspension(SuspensionEntity suspension)
    {
        return UserRepository.UpdateSuspension(suspension);
    }
    public Task<SuspensionEntity?> GetSuspension(string userNic)
    {
        return UserRepository.GetSuspension(userNic);
    }
    public Task<bool> DeleteSuspension(string userNic)
    {
        return UserRepository.DeleteSuspension(userNic);
    }

    public Task<FormEntity?> GetForm()
    {
        return FormRepository.GetForm();
    }

    public Task<TermsEntity?> GetActiveTerms(string language)
    {
        return TermsRepository.GetActiveTerms(language);
    }

    public Task<List<TermsEntity>?> GetTermsHistory(string language)
    {
        return TermsRepository.GetTermsHistory(language);
    }

    public Task<TermsEntity?> GetTermsById(int id)
    {
        return TermsRepository.GetTermsById(id);
    }

    public Task<bool> SubmitTerms(TermsEntity terms)
    {
        return TermsRepository.SubmitTerms(terms);
    }
}