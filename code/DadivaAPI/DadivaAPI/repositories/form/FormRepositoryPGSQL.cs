using DadivaAPI.domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static DadivaAPI.repositories.utils.PGSQLUtils;
using Npgsql;
using Rule = DadivaAPI.domain.Rule;

namespace DadivaAPI.repositories.form
{
    public class FormRepositoryPGSQL : IFormRepository
    {
        
        private readonly FormDbContext _context;
        
        public FormRepositoryPGSQL(FormDbContext context)
        {
            _context = context;
        }
        
        public async Task<Form?> GetForm()
        {
            return await _context.Forms.FirstOrDefaultAsync();
        }

        public async Task<Form> EditForm(Form form)
        {
            _context.Forms.Update(form);
            await _context.SaveChangesAsync();
            return form;
        }

        public async Task<bool> EditInconsistencies(Inconsistencies inconsistencies)
        {
            _context.Inconsistencies.Update(inconsistencies);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Inconsistencies> GetInconsistencies()
        {
            return await _context.Inconsistencies.FirstOrDefaultAsync();
        }

        public async Task<Submission> GetSubmission(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<Dictionary<int, Submission>> GetSubmissions()
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SubmitForm(Submission submission, int id)
        {
            _context.Submissions.Add(submission);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}