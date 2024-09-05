using FluentResults;

namespace DadivaAPI.services.submissions;

public abstract class SubmissionErrors : Error
{
    public class InvalidLanguageErrors() : SubmissionErrors;
    public class SubmissionNotSavedErrors() : SubmissionErrors;
    public class SubmissionNotUpdatedErrors() : SubmissionErrors;
    public class NoPendingSubmissionsErrors() : SubmissionErrors;
    public class NoSubmissionsHistoryErrors() : SubmissionErrors;
    public class SubmissionNotFoundErrors() : SubmissionErrors;
    public class AlreadyLockedByAnotherDoctor(string doctorName) : SubmissionErrors;
    public class NotYourSubmissionToUnlock(string doctorName) : SubmissionErrors;
    public class InvalidStatusErrors() : SubmissionErrors;
    public class SubmissionNotPendingStatusErrors() : SubmissionErrors;
    public class SubmissionNotLockedErrors() : SubmissionErrors;
    public class SubmissionNotLockedTimeoutErrors(List<string> id) : SubmissionErrors;
    public class InvalidDoctorNotesErrors() : SubmissionErrors;
}