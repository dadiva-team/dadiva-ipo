using DadivaAPI.domain;

namespace DadivaAPI.repositories.form;

public class FormRepositoryMemory : IFormRepository
{
    private readonly Dictionary<int, Submission> _submissions = new();

    private Form _form = new([], []);

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
}