using DadivaAPI.routes.form.models;
using FluentResults;

namespace DadivaAPI.services.reviews;

public interface IReviewsService
{
    public Task<Result<bool>> ReviewSubmission(int submissionId, string doctorNic, string status,
        List<NoteModel>? notes, string? finalNote);
}