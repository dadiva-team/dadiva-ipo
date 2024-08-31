using DadivaAPI.domain;
using DadivaAPI.repositories.Entities;
using DadivaAPI.repositories.form;
using DadivaAPI.services.submissions.dtos;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.repositories.submissions
{
    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly DadivaDbContext _context;

        public SubmissionRepository(DadivaDbContext context)
        {
            _context = context;
        }

        public async Task<(int, int, int)> GetStats(DateTime startDate, DateTime endDate)
        {
            var total = await _context.Submissions.CountAsync(s =>
                s.Date >= startDate.ToUniversalTime() && s.Date <= endDate.ToUniversalTime());
            var approved = await _context.Submissions.CountAsync(s =>
                s.Status == SubmissionStatus.Approved && s.Date >= startDate.ToUniversalTime() &&
                s.Date <= endDate.ToUniversalTime());
            var denied = await _context.Submissions.CountAsync(s =>
                s.Status == SubmissionStatus.Rejected && s.Date >= startDate.ToUniversalTime() &&
                s.Date <= endDate.ToUniversalTime());

            return (total, approved, denied);
        }

        public async Task<bool> SubmitSubmission(SubmissionEntity submission)
        {
            _context.ChangeTracker.Clear();
            if (submission.Donor != null)
            {
                _context.Entry(submission.Donor).State = EntityState.Unchanged;
            }

            if (submission.Form != null)
            {
                _context.Entry(submission.Form).State = EntityState.Unchanged;
            }

            await _context.Submissions.AddAsync(submission);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateSubmission(SubmissionEntity submission)
        {
            _context.Submissions.Update(submission);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> SubmitReview(ReviewEntity review)
        {
            _context.ChangeTracker.Clear();
            _context.Entry(review.Doctor).State = EntityState.Unchanged;
            _context.Entry(review.Submission).State = EntityState.Unchanged;

            _context.Entry(review.Submission).Property(s => s.Status).IsModified = true;

            foreach (var answeredQuestion in review.Submission.AnsweredQuestions)
            {
                if (answeredQuestion.NoteText != null)
                {
                    _context.Entry(answeredQuestion).Property(aq => aq.NoteText).IsModified = true;
                }
            }

            _context.Reviews.Add(review);
            // Save the changes to the database
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<MinimalSubmissionDto?> GetLatestPendingSubmissionByUser(string userNic)
        {
            {
                return await GetSubmissionInternalAsync(null, userNic);
            }
        }

        public async Task<MinimalSubmissionDto?> GetSubmissionById(int id)
        {
            return await GetSubmissionInternalAsync(id);
        }

        
        // Aux Function to either get a submission by id or by user nic
        private async Task<MinimalSubmissionDto?> GetSubmissionInternalAsync(int? id = null, string? userNic = null)
        {
            SubmissionEntity? submissionEntity = null;

            if (id.HasValue)
            {
                submissionEntity = await _context.Submissions
                    .Where(s => s.Id == id.Value)
                    .Include(s => s.Donor)
                    .Include(s => s.Form)
                    .Include(s => s.AnsweredQuestions)
                    .ThenInclude(aq => aq.Answer)
                    .Include(s => s.AnsweredQuestions)
                    .ThenInclude(aq => aq.Question)
                    .FirstOrDefaultAsync();
            }
            else if (!string.IsNullOrEmpty(userNic))
            {
                submissionEntity = await _context.Submissions
                    .Where(s => s.Donor.Nic == userNic)
                    .OrderByDescending(s => s.Date) // Assuming 'Date' is a property representing the submission date
                    .Include(s => s.Donor)
                    .Include(s => s.Form)
                    .Include(s => s.AnsweredQuestions)
                    .ThenInclude(aq => aq.Answer)
                    .Include(s => s.AnsweredQuestions)
                    .ThenInclude(aq => aq.Question)
                    .FirstOrDefaultAsync();
            }

            if (submissionEntity == null)
            {
                return null;
            }

            submissionEntity.LockedBy = await _context.Set<LockEntity>()
                .Include(l => l.Doctor)
                .FirstOrDefaultAsync(l =>
                    l.LockEntityType == LockEntityType.submission && l.LockEntityId == submissionEntity.Id);

            foreach (var answeredQuestion in submissionEntity.AnsweredQuestions)
            {
                if (answeredQuestion.Answer is StringListAnswerEntity stringListAnswer)
                {
                    await _context.Entry(stringListAnswer)
                        .Collection(sla => sla.Content)
                        .LoadAsync();
                }
            }

            // Map the submission entity to a MinimalSubmissionDto
            var submissionDto = new MinimalSubmissionDto(
                submissionEntity.Id,
                submissionEntity.Status,
                submissionEntity.LockedBy,
                submissionEntity
                    .AnsweredQuestions, // The AnsweredQuestions include the related Answer and Question entities
                new MinimalUserDto(submissionEntity.Donor.Nic, submissionEntity.Donor.Name),
                new MinimalFormDto(submissionEntity.Form.Id)
            );

            return submissionDto;
        }


        public async Task<List<SubmissionEntity>?> GetPendingSubmissions()
        {
            Console.Out.WriteLine("Getting pending submissions in repository");

            var submissions = await _context.Submissions
                .Include(s => s.Donor)
                .Include(s => s.Form)
                .Include(s => s.AnsweredQuestions)
                .ThenInclude(aq => aq.Answer)
                .Include(s => s.AnsweredQuestions)
                .ThenInclude(aq => aq.Question)
                .Where(s => s.Status == SubmissionStatus.Pending)
                .ToListAsync();

            foreach (var submission in submissions)
            {
                // Load the lock specific to this submission, if it exists
                submission.LockedBy = await _context.Set<LockEntity>()
                    .Include(l => l.Doctor)
                    .FirstOrDefaultAsync(l =>
                        l.LockEntityType == LockEntityType.submission && l.LockEntityId == submission.Id);

                // Load related content for StringListAnswerEntity, if applicable
                foreach (var answeredQuestion in submission.AnsweredQuestions)
                {
                    if (answeredQuestion.Answer is StringListAnswerEntity stringListAnswer)
                    {
                        await _context.Entry(stringListAnswer)
                            .Collection(sla => sla.Content)
                            .LoadAsync();
                    }
                }
            }

            return submissions;
        }


        public async Task<(List<ReviewEntity>? Submissions, bool HasMoreSubmissions)> GetSubmissionHistoryByUser(
            string nic, int limit, int skip)
        {
            var submissions = await _context.Reviews
                .Include(r => r.Submission)
                .Include(r => r.Submission.Donor)
                .Include(r => r.Submission.Form)
                .Include(r => r.Submission.AnsweredQuestions)
                .Where(r => r.Submission.Donor.Nic == nic)
                .OrderByDescending(r => r.Submission.Date)
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

        public async Task<LockEntity?> GetLock(int submissionId)
        {
            return await _context.Locks.Include(l => l.Doctor).FirstOrDefaultAsync(
                l => l.LockEntityType == LockEntityType.submission && l.LockEntityId == submissionId);
        }

        public async Task<bool> LockSubmission(LockEntity lockEntity)
        {
            _context.ChangeTracker.Clear();
            if (lockEntity.Doctor != null)
            {
                _context.Entry(lockEntity.Doctor).State = EntityState.Unchanged;
            }


            _context.Locks.Add(lockEntity);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdatedLockedSubmission(LockEntity lockEntity)
        {
            _context.ChangeTracker.Clear();
            _context.Locks.Update(lockEntity);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UnlockSubmission(LockEntity lockEntity)
        {
            _context.ChangeTracker.Clear();
            if (lockEntity.Doctor != null)
            {
                _context.Entry(lockEntity.Doctor).State = EntityState.Unchanged;
            }

            _context.Locks.Remove(lockEntity);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<LockEntity>> GetExpiredLocks(TimeSpan timeout)
        {
            return await _context.Locks
                .Where(l => l.LockDate < DateTime.UtcNow - timeout)
                .ToListAsync();
        }

        public async Task<bool> SubmissionExists(int id)
        {
            return await _context.Submissions.AnyAsync(e => e.Id == id);
        }
    }
}