using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.services.form.dtos;
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
        
        public async Task<Form> GetForm()
        {
            return await _context.Forms.OrderBy(form => form.AddedOn).LastOrDefaultAsync() ?? throw new Exception("Form not found");
        }
        
        public async Task<Form?> GetFormWithVersion(int version)
        {
            return await _context.Forms.FirstOrDefaultAsync(form => form.Id == version);
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

        public Task<Terms?> GetTerms()
        {
            throw new NotImplementedException();
        }

        public Task<bool> EditTerms(JsonElement terms)
        {
            throw new NotImplementedException();
        }

        public async Task<Inconsistencies> GetInconsistencies()
        {
            return await _context.Inconsistencies.OrderBy(inconsistencies => inconsistencies.Id).LastOrDefaultAsync();
        }

        public async Task<Submission> GetSubmission(int nic)
        {
            return await _context.Submissions.FirstOrDefaultAsync(submission => submission.ByUserNic == nic);
        }
        
        public async Task<Submission?> GetLatestPendingSubmissionByUser(int userNic)
        {
            return await _context.Submissions
                .Where(submission => submission.ByUserNic == userNic && 
                                     !_context.Reviews.Any(review => review.SubmissionId == submission.Id))
                .OrderByDescending(submission => submission.SubmissionDate)
                .FirstOrDefaultAsync();
        }
        
        public async Task<Submission> GetSubmissionById(int id)
        {
            return await _context.Submissions.FirstOrDefaultAsync(submission => submission.Id == id);
        }

        public async Task<Dictionary<int, Submission>> GetSubmissions()
        {
            throw new NotImplementedException();
        }
        
        public async Task<(List<SubmissionHistoryDto>? Submissions, bool HasMoreSubmissions)> GetSubmissionHistoryByNic(int nic, int limit, int skip)
        {
            var submissions = await (from submission in _context.Submissions
                    join review in _context.Reviews on submission.Id equals review.SubmissionId
                    where submission.ByUserNic == nic
                    orderby submission.SubmissionDate descending
                    select new SubmissionHistoryDto
                    {
                        SubmissionId = submission.Id,
                        SubmissionDate = submission.SubmissionDate,
                        ByUserNic = submission.ByUserNic,
                        Answers = submission.AnsweredQuestions,
                        FormVersion = submission.FormVersion,
                        ReviewDate = review.ReviewDate,
                        ReviewStatus = review.Status,
                        DoctorNic = review.DoctorNic
                    })
                .Skip(skip)
                .Take(limit + 1)
                .ToListAsync();

            var hasMoreSubmissions = submissions.Count > limit;
            if (hasMoreSubmissions)
            {
                submissions.RemoveAt(submissions.Count - 1);
            }

            return (submissions, hasMoreSubmissions);
        }


        public async Task<bool> SubmitForm(Submission submission, int id)
        {
            await _context.Submissions.AddAsync(submission);
            return await _context.SaveChangesAsync() > 0;
        }
        
        public async Task<Review> AddReview(Review review)
        {
            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<bool> AddNote(Note note)
        {
            await _context.Notes.AddAsync(note);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}