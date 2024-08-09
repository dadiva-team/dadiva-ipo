using DadivaAPI.repositories.Entities;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.repositories.form
{
    public class FormRepository : IFormRepository
    {

        private readonly DadivaDbContext _context;

        public FormRepository(DadivaDbContext context)
        {
            _context = context;
        }

        public async Task<FormEntity?> GetForm(string language)
        {
            return await _context.Forms
                .Where(form=> form.Language == language)
                .OrderBy(form => form.Date)
                .LastOrDefaultAsync();
        }

        public async Task<bool> AddForm(FormEntity form)
        {
            await _context.Forms.AddAsync(form);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<InconsistencyEntity?> GetInconsistencies()
        {
            return await _context.Inconsistencies.OrderBy(inconsistencies => inconsistencies.Id).LastOrDefaultAsync();
        }

        public async Task<bool> EditInconsistencies(InconsistencyEntity inconsistencies)
        {
            _context.Inconsistencies.Update(inconsistencies);
            return await _context.SaveChangesAsync() > 0;
        }

    }
}