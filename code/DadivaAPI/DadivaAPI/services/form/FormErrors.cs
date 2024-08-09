using FluentResults;

namespace DadivaAPI.services.form;

public abstract class FormErrors : Error
{
    public class NoFormError() : FormErrors;

    public class InvalidLanguageError() : FormErrors;
    
    public class UnknownError() : FormErrors;
    
    public class NoInconsistenciesError() : FormErrors;
}