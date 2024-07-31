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
        
        public async Task<FormEntity> GetForm()
        {
            return await _context.Forms.OrderBy(form => form.Date).LastOrDefaultAsync() ?? throw new Exception("Form not found");
        }
        
        public async Task<FormEntity?> GetFormWithVersion(int version)
        {
            return await _context.Forms.FirstOrDefaultAsync(form => form.Id == version);
        }

        public async Task<FormEntity> EditForm(FormEntity form)
        {
            await _context.Forms.AddAsync(form);
            await _context.SaveChangesAsync();
            return form;
        }

        public async Task<bool> EditInconsistencies(InconsistencyEntity inconsistencies)
        {
            _context.Inconsistencies.Update(inconsistencies);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<InconsistencyEntity> GetInconsistencies()
        {
            return await _context.Inconsistencies.OrderBy(inconsistencies => inconsistencies.Id).LastOrDefaultAsync();
        }

        public async Task<SubmissionEntity> GetSubmission(int nic)
        {
            return await _context.Submissions.FirstOrDefaultAsync(submission => submission.ByUserNic == nic);
        }
        
        public async Task<SubmissionEntity?> GetLatestPendingSubmissionByUser(int userNic)
        {
            return await (from submission in _context.Submissions
                join subLock in _context.SubmissionLocks
                    on submission.Id equals subLock.SubmissionId into locks
                from subLock in locks.DefaultIfEmpty()
                where submission.ByUserNic == userNic && !_context.Reviews.Any(review => review.SubmissionId == submission.Id)
                orderby submission.SubmissionDate descending
                select new SubmissionPendingDto
                {
                    Id = submission.Id,
                    Answers = submission.AnsweredQuestions,
                    SubmissionDate = submission.SubmissionDate,
                    ByUserNic = submission.ByUserNic,
                    FormVersion = submission.FormVersion,
                    LockedByDoctorNic = subLock.LockedByDoctorNic
                }).FirstOrDefaultAsync();
        }
        
        public async Task<SubmissionEntity?> GetSubmissionById(int id)
        {
            return await _context.Submissions.FirstOrDefaultAsync(submission => submission.Id == id);
        }

        public async Task<List<SubmissionEntity>?> GetPendingSubmissions()
        {
            Console.Out.WriteLine("Getting pending submissions in repository");
            
            return await (from submission in _context.Submissions
                join subLock in _context.SubmissionLocks
                    on submission.Id equals subLock.SubmissionId into locks
                from subLock in locks.DefaultIfEmpty()
                where !_context.Reviews.Any(review => review.SubmissionId == submission.Id)
                orderby submission.SubmissionDate
                select new SubmissionPendingDto
                {
                    Id = submission.Id,
                    Answers = submission.AnsweredQuestions,
                    SubmissionDate = submission.SubmissionDate,
                    ByUserNic = submission.ByUserNic,
                    FormVersion = submission.FormVersion,
                    LockedByDoctorNic = subLock.LockedByDoctorNic
                }).ToListAsync();
            
        }
        
        public async Task<(List<SubmissionEntity>? Submissions, bool HasMoreSubmissions)> GetSubmissionHistoryByNic(int nic, int limit, int skip)
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
        
        public async Task<bool> LockSubmission(int submissionId, int doctorNic)
        {
            var existingLock = await _context.SubmissionLocks.FirstOrDefaultAsync(l => l.SubmissionId == submissionId);
            if (existingLock != null && (existingLock.LockedByDoctorNic != doctorNic))
                return false;

            if (existingLock == null)
            {
                _context.SubmissionLocks.Add(new SubmissionLock(submissionId,doctorNic,DateTime.UtcNow));
            }
            else
            {
                existingLock.LockDate = DateTime.UtcNow;
                existingLock.LockedByDoctorNic = doctorNic;
            }

            return await _context.SaveChangesAsync() > 0;
        }
        
        public async Task<bool> UnlockSubmission(int submissionId, int doctorNic)
        {
            var existingLock = await _context.SubmissionLocks.FirstOrDefaultAsync(l => l.SubmissionId == submissionId);
            if (existingLock == null || existingLock.LockedByDoctorNic != doctorNic)
                return false;

            _context.SubmissionLocks.Remove(existingLock);
            return await _context.SaveChangesAsync() > 0;
        }
        
        public async Task<List<SubmissionEntity>> GetExpiredLocks(TimeSpan timeout)
        {
            return await _context.SubmissionLocks
                .Where(l => l.LockDate < DateTime.UtcNow - timeout)
                .ToListAsync();
        }

        
        public async Task<bool> SubmissionExists(int id)
        {
            return await _context.Submissions.AnyAsync(e => e.Id == id);
        }


        public async Task<bool> SubmitForm(SubmissionEntity submission)
        {
            await _context.Submissions.AddAsync(submission);
            return await _context.SaveChangesAsync() > 0;
        }
        
        public async Task<ReviewEntity> AddReview(ReviewEntity review)
        {
            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();
            return review;
        }
        
        
        public async Task<bool> AddNote(string note, int SubmissionId)
        {
            await _context.Notes.AddAsync(note);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}