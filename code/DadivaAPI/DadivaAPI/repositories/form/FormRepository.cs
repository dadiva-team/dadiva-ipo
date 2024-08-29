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

        public async Task<FormEntity?> GetFormWithId(int formId)
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
                .Include(f => f.Rules)
                .ThenInclude(r => r.Inconsistency)
                .Include(f => f.Admin)
                .Where(f => f.Id == formId) // Use formId to filter
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


        public async Task<InconsistencyEntity?> GetInconsistencies(int? formId = null)
        {
            IQueryable<InconsistencyEntity> query = _context.Inconsistencies
                .Include(i => i.Form)
                .ThenInclude(f => f.QuestionGroups)
                .ThenInclude(qg => qg.Questions)
                .Include(i => i.Form)
                .ThenInclude(f => f.Admin)
                .Include(i => i.Admin)
                .Include(f => f.Rules)
                .ThenInclude(r => r.Event)
                .Include(i => i.Rules)
                .ThenInclude(r => r.TopLevelCondition)
                .ThenInclude(tlc => (tlc as AllConditionEntity).All)
                .Include(i => i.Rules)
                .ThenInclude(r => r.TopLevelCondition)
                .ThenInclude(tlc => (tlc as AnyConditionEntity).Any);
            
           
            if (formId != null)
            {
                query = query.Where(i => i.Form.Id == formId);
            }

            var inconsistency = await query
                .OrderByDescending(i => i.Id) // Order by descending to get the latest one
                .FirstOrDefaultAsync();

            if (inconsistency == null) return null;

            var processedConditions = new HashSet<int>();

            // Explicitly load nested conditions for each rule
            foreach (var rule in inconsistency.Rules)
            {
                if (rule.TopLevelCondition != null)
                {
                    await LoadNestedConditions(rule.TopLevelCondition, processedConditions);
                }
            }

            return inconsistency;
        }


        public async Task<bool> EditInconsistencies(InconsistencyEntity inconsistencies)
        {
            // Check if an InconsistencyEntity already exists for the given FormId
            var existingInconsistency = await _context.Inconsistencies
                .Include(i => i.Rules)  // Include rules to ensure they are loaded and can be modified
                .FirstOrDefaultAsync(i => i.Form.Id == inconsistencies.Form.Id);

            if (existingInconsistency != null)
            {
                // Remove old rules from the existing inconsistency
                _context.Rules.RemoveRange(existingInconsistency.Rules);

                // Assign the new rules to the existing inconsistency
                existingInconsistency.Rules = inconsistencies.Rules;
                existingInconsistency.Admin = inconsistencies.Admin;
                existingInconsistency.Date = inconsistencies.Date;
                existingInconsistency.Reason = inconsistencies.Reason;

                // Mark related entities as unchanged
                if (existingInconsistency.Admin != null)
                {
                    _context.Entry(existingInconsistency.Admin).State = EntityState.Unchanged;
                }

                if (existingInconsistency.Form != null)
                {
                    _context.Entry(existingInconsistency.Form).State = EntityState.Unchanged;
                }

                _context.Inconsistencies.Update(existingInconsistency);
            }
            else
            {
                // This is the first time editing; create a new inconsistency
                if (inconsistencies.Admin != null)
                {
                    _context.Entry(inconsistencies.Admin).State = EntityState.Unchanged;
                }

                if (inconsistencies.Form != null)
                {
                    _context.Entry(inconsistencies.Form).State = EntityState.Unchanged;
                }

                await _context.Inconsistencies.AddAsync(inconsistencies);
            }

            // Save changes and return the result
            return await _context.SaveChangesAsync() > 0;
        }


    }
}