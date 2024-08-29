using DadivaAPI.domain.user;
using DadivaAPI.repositories.Entities;
using DadivaAPI.routes.form.models;
using DadivaAPI.services.submissions.dtos;

namespace DadivaAPI.domain;

public enum SubmissionLanguages
{
    Pt,
    En
}

public record Submission(
    List<AnsweredQuestion> AnsweredQuestions,
    DateTime SubmissionDate,
    SubmissionStatus Status,
    SubmissionLanguages Language,
    User Donor,
    Form Form,
    Lock? Locked
)
{
    public int Id { get; init; }
    public bool IsFullyAnswered()
    {
        return AnsweredQuestions.All(q => q.Answer.ValidateAnswer());
    }
    
    public bool ValidateDoctorNotes()
    {
        foreach (var aq in AnsweredQuestions)
        {
            if (aq.NoteText is { Length: > 256 or 0 })
                return false;
        }
        return true;
    }
    
    public Submission AddNotesToAnsweredQuestions(List<NoteModel> noteModels)
    {
        var updatedAnsweredQuestions = AnsweredQuestions.Select(aq =>
        {
            var noteModel = noteModels.FirstOrDefault(n => n.QuestionId == aq.Question.Id);
            return noteModel != null ? aq with { NoteText = noteModel.NoteText } : aq;
        }).ToList();

        return this with { AnsweredQuestions = updatedAnsweredQuestions };
    }
    
    public Submission UpdateStatus(SubmissionStatus status)
    {
        return this with { Status = status };
    }
    
    public Submission UpdateStatusFromString(string status)
    {
        return this with { Status = status switch
        {
            "Pending" => SubmissionStatus.Pending,
            "Approved" => SubmissionStatus.Approved,
            "Rejected" => SubmissionStatus.Rejected,
            _ => throw new ArgumentException("Invalid status")
        }};
    }
    
    public bool ValidateStatus(string status)
    {
        return status switch
        {
            "Approved" => true,
            "Rejected" => true,
            _ => false
        };
    }
    
    public SubmissionEntity ToEntity(UserEntity donor, FormEntity form)
    {
        return new SubmissionEntity
        {
            Id = Id,
            Date = SubmissionDate,
            Donor = donor,
            LockedBy = Locked?.ToEntity(),
            Form = form,
            Status = Status,
            Language = Language,
            AnsweredQuestions = AnsweredQuestions.Select(aq => aq.ToEntity()).ToList()
        };
    }

    public SubmissionWithLockExternalInfo ToExternalInfo(List<RuleModel> inconsistencies)
    {
        return new SubmissionWithLockExternalInfo(Id, SubmissionDate, Status, AnsweredQuestions, Donor.ToUserWithNameExternalInfo(), inconsistencies, Locked?.ToSubmissionExternalInfo()
        );
    }
  

    public SubmissionExternalInfo ToSubmissionExternalInfo()
    {
        return new SubmissionExternalInfo(Id, SubmissionDate, Status, AnsweredQuestions, Donor.Nic, Donor.Name,
            Form.Groups);
    }
}