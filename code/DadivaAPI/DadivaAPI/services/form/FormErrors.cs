using FluentResults;

namespace DadivaAPI.services.form;

public abstract class FormErrors : Error
{
    public class NoFormError() : FormErrors;
}