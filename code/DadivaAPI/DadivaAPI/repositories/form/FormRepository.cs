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
            var form = await _context.Forms
                .AsNoTracking()
                .Include(f => f.QuestionGroups)
                .ThenInclude(qg => qg.Questions)
                .Include(f => f.Rules)
                .ThenInclude(r => r.Event)
                .Include(f => f.Rules)
                .ThenInclude(r => r.TopLevelCondition)
                .ThenInclude(tlc => (tlc as AllConditionEntity).All)
                .Include(f => f.Rules)
                .ThenInclude(r => r.TopLevelCondition)
                .ThenInclude(tlc => (tlc as AnyConditionEntity).Any)
                .Include(f => f.Admin)
                .Where(f => f.Language == language)
                .OrderByDescending(f => f.Date)
                .FirstOrDefaultAsync();

            if (form == null) return null;
            
            var processedConditions = new HashSet<int>();

            // Explicitly load nested conditions for each rule
            foreach (var rule in form.Rules)
            {
                if (rule.TopLevelCondition != null)
                {
                    await LoadNestedConditions(rule.TopLevelCondition, processedConditions);
                }
            }

            return form;
        }


        private async Task LoadNestedConditions(NestedConditionEntity condition, HashSet<int> processedConditions)
        {
            if (condition == null || processedConditions.Contains(condition.Id))
                return;
            
            processedConditions.Add(condition.Id);

            switch (condition)
            {
                case AllConditionEntity allCondition:
                    if (!_context.Entry(allCondition).Collection(ac => ac.All).IsLoaded)
                    {
                        await _context.Entry(allCondition).Collection(ac => ac.All).LoadAsync();
                    }
                    // Deduplicate nested conditions
                    allCondition.All = allCondition.All
                        .GroupBy(c => c.Id)
                        .Select(g => g.First())
                        .ToList();

                    foreach (var nestedCondition in allCondition.All)
                    {
                        await LoadNestedConditions(nestedCondition, processedConditions);
                    }
                    break;

                case AnyConditionEntity anyCondition:
                    if (!_context.Entry(anyCondition).Collection(ac => ac.Any).IsLoaded)
                    {
                        await _context.Entry(anyCondition).Collection(ac => ac.Any).LoadAsync();
                    }
                    // Deduplicate nested conditions
                    anyCondition.Any = anyCondition.Any
                        .GroupBy(c => c.Id)
                        .Select(g => g.First())
                        .ToList();

                    foreach (var nestedCondition in anyCondition.Any)
                    {
                        await LoadNestedConditions(nestedCondition, processedConditions);
                    }
                    break;

                case ConditionPropertiesEntity propertiesCondition:
                    if (!_context.Entry(propertiesCondition).IsKeySet)
                    {
                        _context.Attach(propertiesCondition);
                    }
                    break;
            }
        }




        public async Task<bool> AddForm(FormEntity form)
        {
            _context.ChangeTracker.Clear();

            if (form.PreviousForm != null)
            {
                _context.Entry(form.PreviousForm).State = EntityState.Unchanged;
            }

            if (form.Admin != null)
            {
                _context.Entry(form.Admin).State = EntityState.Unchanged;
            }

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