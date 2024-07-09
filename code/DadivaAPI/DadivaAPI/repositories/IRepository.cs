using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.repositories.cftToManual;
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
    
    public ICftToManualRepository CftToManualRepository { get; }
    
    public IManualRepository ManualRepository { get; }
    
    public async Task<Form?> GetForm()
    {
        return await FormRepository.GetForm();
    }
    
    public async Task<Form?> GetFormWithVersion(int version)
    {
        return await FormRepository.GetFormWithVersion(version);
    }

    public async Task<Form> EditForm(Form form)
    {
        return await FormRepository.EditForm(form);
    }
    
    public async Task<bool> SubmitForm(Submission submission, int nic)
    {
        return await FormRepository.SubmitForm(submission, nic);
    }
    
    public async Task<Dictionary<int, Submission>> GetSubmissions()
    {
        return await FormRepository.GetSubmissions();
    }

    public async Task<Submission> GetSubmission(int nic)
    {
        return await FormRepository.GetSubmission(nic);
    }
    
    public async Task<Submission> GetSubmissionById(int id)
    {
        return await FormRepository.GetSubmissionById(id);
    }
    
    public async Task<Submission?> GetLatestPendingSubmissionByUser(int userNic)
    {
        return await FormRepository.GetLatestPendingSubmissionByUser(userNic);
    }
    
    public async Task<List<Submission>?> GetSubmissionHistoryByNic(int nic, int limit, int skip)
    {
        return await FormRepository.GetSubmissionHistoryByNic(nic, limit, skip);
    }

    public async Task<Inconsistencies> GetInconsistencies()
    {
        return await FormRepository.GetInconsistencies();
    }
    
    public async Task<Review> AddReview(Review review)
    {
        return await FormRepository.AddReview(review);
    }
    
    public async Task<bool> AddNote(Note note)
    {
        return await FormRepository.AddNote(note);
    }
    
    public async Task<bool> EditInconsistencies(Inconsistencies inconsistencies)
    {
        return await FormRepository.EditInconsistencies(inconsistencies);
    }

    public async Task<bool> AddUser(User user)
    {
        return await UserRepository.AddUser(user);
    }

    public async Task<List<User>?> GetUsers()
    {
        return await UserRepository.GetUsers();
    }

    public async Task<User?> GetUserByNic(int nic)
    {
        return await UserRepository.GetUserByNic(nic);
    }

    public async Task<Boolean> DeleteUser(int nic)
    {
        return await UserRepository.DeleteUser(nic);
    }
    
    public async Task<UserAccountStatus?> GetUserAccountStatus(int userNic)
    {
        return await UserRepository.GetUserAccountStatus(userNic);
    }
    
    public async Task<Boolean> UpdateUserAccountStatus(UserAccountStatus userAccountStatus)
    {
        return await UserRepository.UpdateUserAccountStatus(userAccountStatus);
    }
    
    public async Task<Terms?> GetTerms()
    {
        return await TermsRepository.GetTerms();
    }
    
    public async Task<Boolean> SubmitTerms(JsonElement terms)
    {
        return await TermsRepository.SubmitTerms(terms);
    }
    
    public async Task<List<string>> SearchMedications(string query)
    {
        return await MedicationRepository.SearchMedications(query);
    }
    
    public Task<List<string>> GetCfts(string productName)
    {
        return MedicationRepository.GetCfts(productName);
    }
    
    public async Task<string> GetManualEntryFromCft(string cft)
    {
        return await CftToManualRepository.GetManualEntryFromCft(cft);
    }
    
    public async Task<bool> AddCftToManualEntry(string cft, string manualEntry)
    {
        return await CftToManualRepository.AddCftToManualEntry(cft, manualEntry);
    }
    
    public async Task<List<string>> GetManualEntriesFromCfts(List<string> cfts)
    {
        return await CftToManualRepository.GetManualEntriesFromCfts(cfts);
    }
    
    public async Task<List<ManualInformation>> GetManualInformations(List<string> manualEntries)
    {
        return await ManualRepository.GetManualInformations(manualEntries);
    }
}