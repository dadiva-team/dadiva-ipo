using FluentResults;

namespace DadivaAPI.services.terms;

public abstract class TermsErrors : Error
{
    public class InvalidLanguageError() : TermsErrors;
    
    public class NoTermsError() : TermsErrors;
    
    public class UnknownTermsError() : TermsErrors;
}