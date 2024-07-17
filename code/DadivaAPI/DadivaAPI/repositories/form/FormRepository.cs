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

        public async Task<List<Submission>> GetPendingSubmissions()
        {
            Console.Out.WriteLine("Getting pending submissions in repository");
            return await _context.Submissions.Where(submission =>
                    !_context.Reviews.Any(review => review.SubmissionId == submission.Id))
                .OrderBy(submission => submission.SubmissionDate).ToListAsync();
        }
        
        public async Task<(List<SubmissionHistoryDto>? Submissions, bool HasMoreSubmissions)> GetSubmissionHistoryByNic(int nic, int limit, int skip)
        {
            var submissionsWithNotes = await (from submission in _context.Submissions
                    join review in _context.Reviews on submission.Id equals review.SubmissionId
                    join note in _context.Notes on review.Id equals note.ReviewId into notesGroup
                    where submission.ByUserNic == nic
                    orderby submission.SubmissionDate descending
                    select new { submission, review, Notes = notesGroup })
                .Skip(skip)
                .Take(limit + 1)
                .ToListAsync();

            var submissions = submissionsWithNotes.Select(s => new SubmissionHistoryDto
            {
                SubmissionId = s.submission.Id,
                SubmissionDate = s.submission.SubmissionDate,
                ByUserNic = s.submission.ByUserNic,
                Answers = s.submission.AnsweredQuestions,
                FinalNote = s.review.FinalNote,
                FormVersion = s.submission.FormVersion,
                ReviewDate = s.review.ReviewDate,
                ReviewStatus = s.review.Status,
                DoctorNic = s.review.DoctorNic,
                Notes = s.Notes.Select(n => new NoteDto { Id = n.QuestionId, Note = n.NoteText }).ToList()
            }).ToList();

            var hasMoreSubmissions = submissions.Count > limit;
            if (hasMoreSubmissions)
            {
                submissions.RemoveAt(submissions.Count - 1);
            }

            return (submissions, hasMoreSubmissions);
        }


        public async Task<bool> SubmitForm(Submission submission)
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