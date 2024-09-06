using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;
using DadivaAPI.repositories.form;
using DadivaAPI.repositories.manual;
using DadivaAPI.repositories.medications;
using DadivaAPI.repositories.submissions;
using DadivaAPI.repositories.terms;
using DadivaAPI.repositories.users;
using DadivaAPI.services.submissions.dtos;

namespace DadivaAPI.repositories;

public interface IRepository
{
    public IUsersRepository UserRepository { get; }
    public IFormRepository FormRepository { get; }
    public ITermsRepository TermsRepository { get; }
    public ISubmissionRepository SubmissionRepository { get; }
    public IMedicationsRepository MedicationRepository { get; }
    public IManualRepository ManualRepository { get; }

    /*USER*/
    public Task<UserEntity?> GetUserByNic(string nic);
    public Task<bool> AddUser(UserEntity user);
    public Task<bool> UpdateUser(UserEntity user);
    public Task<List<UserEntity>> GetUsers();
    public Task<bool> DeleteUser(string nic);

    public Task<bool> AddSuspension(SuspensionEntity suspension);
    public Task<bool> UpdateSuspension(SuspensionEntity suspension);
    public Task<SuspensionEntity?> GetSuspension(string userNic);
    public Task<List<SuspensionEntity>> GetSuspensions(string userNic);
    public Task<SuspensionEntity?> GetSuspensionIfActive(string userNic);
    public Task<bool> UpdateSuspensionIsActive(string userNic, bool isActive);
    public Task<bool> UpdateSuspensionsTypeAndDate(string userNic, SuspensionType type, DateTime startDate, DateTime? endDate);
    public Task<bool> DeleteSuspension(string userNic);

    /*FORM*/
    public Task<FormEntity?> GetForm(string language);

    public Task<FormEntity?> GetFormById(int id);
    public Task<bool> AddForm(FormEntity form);
    public Task<MinimalInconsistencyDto?> GetInconsistencies(int? formId = null);
    public Task<bool> SubmitInconsistencies(InconsistencyEntity inconsistencies);

    /*TERMS*/
    public Task<TermsEntity?> GetActiveTerms(string language);
    public Task<List<TermsEntity>?> GetTermsHistory(string language);
    public Task<TermsEntity?> GetTermsById(int id);
    public Task<bool> SubmitTerms(TermsEntity terms);

    /*SUBMISSIONS*/

    public Task<bool> SubmitSubmission(SubmissionEntity submission);
    public Task<bool> UpdateSubmission(SubmissionEntity submission);
    public Task<bool> SubmitReview(ReviewEntity review);
    public Task<List<SubmissionEntity>?> GetPendingSubmissions();

    public Task<MinimalSubmissionDto?> GetSubmissionById(int id);

    public Task<MinimalSubmissionDto?> GetLatestPendingSubmissionByUser(string userNic);

    public Task<(List<MinimalReviewDto>? Submissions, bool HasMoreSubmissions)> GetSubmissionHistoryByUser(string nic,
        int limit, int skip);

    public Task<LockEntity?> GetLock(int submissionId);

    public Task<bool> LockSubmission(LockEntity lockEntity);

    public Task<bool> UpdatedLockedSubmission(LockEntity lockEntity);

    public Task<bool> UnlockSubmission(LockEntity lockEntity);

    public Task<List<LockEntity>> GetExpiredLocks(TimeSpan timeout);

    public Task<bool> SubmissionExists(int id);
    
    public Task<(int, int, int)> GetStats(DateTime startDate, DateTime endDate);
    
    public Task<List<DailySubmissionStats>> GetDailyStats(DateTime startDate, DateTime endDate);


    /*MEDICATIONS*/
    public Task<List<string>> SearchMedications(string query);


    /*MANUAL*/
    Task<List<ManualEntryEntity>> GetManualEntries(List<string> cfts);

    public Task<List<string>> GetCfts(string productName);
    
}