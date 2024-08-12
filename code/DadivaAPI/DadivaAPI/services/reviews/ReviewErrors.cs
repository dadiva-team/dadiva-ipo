using FluentResults;

namespace DadivaAPI.services.reviews;

public abstract class ReviewErrors : Error
{
    public class ReviewNotSavedError() : ReviewErrors;
}