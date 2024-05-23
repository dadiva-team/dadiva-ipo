using DadivaAPI.domain;

namespace DadivaAPI.repositories.form;

public class FormRepositoryMemory : IFormRepository
{
    private readonly Dictionary<int, Submission> _submissions = new();

    private Form _form = new([], []);
    
    private List<Rule> _inconsistencies = [];

    public async Task<Form> GetForm()
    {
        return _form;
    }

    public async Task<Form> EditForm(Form form)
    {
        _form = form;
        return form;
    }

    public async Task<bool> SubmitForm(Submission submission, int nic)
    {
        _submissions.Add(nic, submission);
        return true;
    }

    public async Task<Dictionary<int, Submission>> GetSubmissions()
    {
        return _submissions;
    }

    public async Task<Inconsistencies> GetInconsistencies()
    {
        return new Inconsistencies(_inconsistencies);
    }
    
    public async Task<bool> EditInconsistencies(Inconsistencies inconsistencies)
    {
        _inconsistencies = inconsistencies.InconsistencyList;
        return true;
    }
}