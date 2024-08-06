using DadivaAPI.repositories.Entities;
using DadivaAPI.repositories.form;
using DadivaAPI.repositories.manual;
using DadivaAPI.repositories.medications;
using DadivaAPI.repositories.submissions;
using DadivaAPI.repositories.terms;
using DadivaAPI.repositories.users;

namespace DadivaAPI.repositories;

public class Repository(DadivaDbContext context) : IRepository
{
    public IUsersRepository UserRepository { get; } = new UsersRepository(context);
    public IFormRepository FormRepository { get; } = new FormRepository(context);
    public ISubmissionRepository SubmissionRepository { get; } = new SubmissionRepository(context);
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

    public Task<bool> SubmitTerms1(TermsEntity terms)
    {
        return TermsRepository.SubmitTerms(terms);
    }
    
    public Task<List<SubmissionEntity>?> GetPendingSubmissions()
    {
        return SubmissionRepository.GetPendingSubmissions();
    }
    
    public Task<SubmissionEntity?> GetSubmissionById(int id)
    {
        return SubmissionRepository.GetSubmissionById(id);
    }
    
    public Task<SubmissionEntity?> GetLatestPendingSubmissionByUser(string userNic)
    {
        return SubmissionRepository.GetLatestPendingSubmissionByUser(userNic);
    }
    
    public Task<(List<ReviewEntity>? Submissions, bool HasMoreSubmissions)> GetSubmissionHistoryByUser(string nic,
        int limit, int skip)
    {
        return SubmissionRepository.GetSubmissionHistoryByUser(nic, limit, skip);
    }
    
    public Task<LockEntity?> GetLock(int submissionId)
    {
        return SubmissionRepository.GetLock(submissionId);
    }
    
    public Task<bool> LockSubmission(LockEntity lockEntity)
    {
        return SubmissionRepository.LockSubmission(lockEntity);
    }
    
    public Task<bool> UpdatedLockedSubmission(LockEntity lockEntity)
    {
        return SubmissionRepository.UpdatedLockedSubmission(lockEntity);
    }
    
    public Task<bool> UnlockSubmission(LockEntity lockEntity)
    {
        return SubmissionRepository.UnlockSubmission(lockEntity);
    }
    
    public Task<List<LockEntity>> GetExpiredLocks(TimeSpan timeout)
    {
        return SubmissionRepository.GetExpiredLocks(timeout);
    }
    
    public Task<bool> SubmissionExists(int id)
    {
        return SubmissionRepository.SubmissionExists(id);
    }
}