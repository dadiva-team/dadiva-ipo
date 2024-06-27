using DadivaAPI.domain;

namespace DadivaAPI.repositories.form;

public interface IFormRepository
{
    public Task<Form> GetForm();
    
    public Task<Form> EditForm(Form form);
    
    public Task<bool> SubmitForm(Submission submission, int nic);
    
    public Task<Dictionary<int, Submission>> GetSubmissions();
    
    public Task<Submission> GetSubmission(int nic);
    public Task<Submission> GetSubmissionById(int id);
    
    public Task<Inconsistencies> GetInconsistencies();
    
    public Task<Review> AddReview(Review review);
    
    public Task<bool> AddNote(Note note);
    
    public Task<bool> EditInconsistencies(Inconsistencies inconsistencies);
}