using DadivaAPI.domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static DadivaAPI.repositories.utils.PGSQLUtils;
using Npgsql;
using Rule = DadivaAPI.domain.Rule;

namespace DadivaAPI.repositories.form
{
    public class FormRepository : IFormRepository
    {
        
        private readonly DadivaDbContext _context;
        
        public FormRepository(DadivaDbContext context)
        {
            _context = context;
        }
        
        public async Task<Form> GetForm()
        {
            return await _context.Forms.OrderBy(form => form.AddedOn).LastOrDefaultAsync() ?? throw new Exception("Form not found");
        }

        public async Task<Form> EditForm(Form form)
        {
            await _context.Forms.AddAsync(form);
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
            return await _context.Inconsistencies.OrderBy(inconsistencies => inconsistencies.Id).LastOrDefaultAsync();
        }

        public async Task<Submission> GetSubmission(int nic)
        {
            return await _context.Submissions.FirstAsync(submission => submission.ByUserNic == nic);
        }

        public async Task<Dictionary<int, Submission>> GetSubmissions()
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SubmitForm(Submission submission, int id)
        {
            await _context.Submissions.AddAsync(submission);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}