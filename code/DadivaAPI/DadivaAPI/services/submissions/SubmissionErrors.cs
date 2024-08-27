using FluentResults;

namespace DadivaAPI.services.submissions;

public abstract class SubmissionError : Error
{
    public class InvalidLanguageError() : SubmissionError;
    public class SubmissionNotSavedError() : SubmissionError;
    public class SubmissionNotUpdatedError() : SubmissionError;
    public class NoPendingSubmissionsError() : SubmissionError;
    public class NoSubmissionsHistoryError() : SubmissionError;
    public class SubmissionNotFoundError() : SubmissionError;
    public class AlreadyLockedByAnotherDoctor(string doctorName) : SubmissionError;
    public class NotYourSubmissionToUnlock(string doctorName) : SubmissionError;
    public class InvalidStatusError() : SubmissionError;
    public class SubmissionNotPendingStatusError() : SubmissionError;
    public class SubmissionNotLockedError() : SubmissionError;
    public class SubmissionNotLockedTimeoutError(List<string> id) : SubmissionError;
    public class InvalidDoctorNotesError() : SubmissionError;
}