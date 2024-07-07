using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.repositories.form;
using DadivaAPI.repositories.terms;
using DadivaAPI.repositories.users;

namespace DadivaAPI.repositories;

public interface IRepository
{
    public IFormRepository FormRepository { get; }
    public IUsersRepository UserRepository { get; }
    public ITermsRepository TermsRepository { get; }

    public Task<Form?> GetForm()
    {
        return FormRepository.GetForm();
    }
    
    public Task<Form?> GetFormWithVersion(int version)
    {
        return FormRepository.GetFormWithVersion(version);
    }

    public Task<Form> EditForm(Form form)
    {
        return FormRepository.EditForm(form);
    }
    
    public Task<bool> SubmitForm(Submission submission, int nic)
    {
        return FormRepository.SubmitForm(submission, nic);
    }
    
    public Task<Dictionary<int, Submission>> GetSubmissions()
    {
        return FormRepository.GetSubmissions();
    }

    public Task<Submission> GetSubmission(int nic)
    {
        return FormRepository.GetSubmission(nic);
    }
    
    public Task<Submission> GetSubmissionById(int id)
    {
        return FormRepository.GetSubmissionById(id);
    }
    
    public Task<Submission?> GetLatestPendingSubmissionByUser(int userNic)
    {
        return FormRepository.GetLatestPendingSubmissionByUser(userNic);
    }
    
    public Task<List<Submission>?> GetSubmissionHistoryByNic(int nic, int limit, int skip)
    {
        return FormRepository.GetSubmissionHistoryByNic(nic, limit, skip);
    }

    public Task<Inconsistencies> GetInconsistencies()
    {
        return FormRepository.GetInconsistencies();
    }
    
    public Task<Review> AddReview(Review review)
    {
        return FormRepository.AddReview(review);
    }
    
    public Task<bool> AddNote(Note note)
    {
        return FormRepository.AddNote(note);
    }
    
    public Task<bool> EditInconsistencies(Inconsistencies inconsistencies)
    {
        return FormRepository.EditInconsistencies(inconsistencies);
    }

    public Task<bool> AddUser(User user)
    {
        return UserRepository.AddUser(user);
    }

    public Task<List<User>?> GetUsers()
    {
        return UserRepository.GetUsers();
    }

    public Task<User?> GetUserByNic(int nic)
    {
        return UserRepository.GetUserByNic(nic);
    }

    public Task<Boolean> DeleteUser(int nic)
    {
        return UserRepository.DeleteUser(nic);
    }
    
    public Task<UserAccountStatus?> GetUserAccountStatus(int userNic)
    {
        return UserRepository.GetUserAccountStatus(userNic);
    }
    
    public Task<Boolean> UpdateUserAccountStatus(UserAccountStatus userAccountStatus)
    {
        return UserRepository.UpdateUserAccountStatus(userAccountStatus);
    }
    
    public Task<Terms?> GetTerms()
    {
        return TermsRepository.GetTerms();
    }
    
    public Task<Boolean> SubmitTerms(JsonElement terms)
    {
        return TermsRepository.SubmitTerms(terms);
    }
}