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
    public Submission UpdateStatusFromBoolean(bool status)
    {
        return this with { Status = status switch
        {
            true => SubmissionStatus.Approved,
            false => SubmissionStatus.Rejected
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
    
    public SubmissionEntity ToEntity(FormEntity? form = null)
    {
        return new SubmissionEntity
        {
            Id = Id,
            Date = SubmissionDate,
            Donor = Donor.ToEntity(),
            LockedBy = Locked?.ToEntity(),
            Form = form ?? Form.ToEntity(null, null, null),
            Status = Status,
            Language = Language,
            AnsweredQuestions = AnsweredQuestions.Select(aq => aq.ToEntity()).ToList()
        };
    }

    public SubmissionWithLockExternalInfo ToExternalInfo(List<RuleModel>? inconsistencies)
    {
        return new SubmissionWithLockExternalInfo(Id, SubmissionDate, Status, AnsweredQuestions, Donor.ToUserWithNameExternalInfo(), inconsistencies, Locked?.ToSubmissionExternalInfo()
        );
    }
  

    public SubmissionExternalInfo ToSubmissionExternalInfo()
    {
        return new SubmissionExternalInfo(Id, SubmissionDate, Status, AnsweredQuestions, Donor.Nic, Donor.Name,
            Form.Groups);
    }
    
    public static Submission CreateMinimalSubmissionDomain(MinimalSubmissionDto submissionDto)
    {
        var donorUser = User.CreateMinimalUser(submissionDto.Donor);
        var form = Form.CreateMinimalForm(submissionDto.Form, donorUser);

        return new Submission(
            submissionDto.AnsweredQuestions.Select(aq => aq.ToDomain()).ToList(),
            submissionDto.SubmissionDate,
            submissionDto.Status,
            SubmissionLanguages.En, 
            donorUser,
            form, 
            submissionDto.LockedBy?.ToDomain() 
        )
        {
            Id = submissionDto.Id
        };
    }

}