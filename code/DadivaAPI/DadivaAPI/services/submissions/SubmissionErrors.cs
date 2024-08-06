using FluentResults;

namespace DadivaAPI.services.submissions;

public abstract class SubmissionError : Error
{
    public class NoPendingSubmissionsError() : SubmissionError;
    public class NoSubmissionsHistoryError() : SubmissionError;
}