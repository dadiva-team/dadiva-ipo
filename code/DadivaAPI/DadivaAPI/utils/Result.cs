namespace DadivaAPI.utils;



public abstract class Result<V, E>
{
    private Result() { } // Prevent external subclassing beyond Success and Failure

    public class SuccessResult : Result<V, E>
    {
        public V Value { get; }

        internal SuccessResult(V value)
        {
            Value = value;
        }
    }

    public class FailureResult : Result<V, E>
    {
        public E Error { get; }

        internal FailureResult(E error)
        {
            Error = error;
        }
    }

    // Factory methods
    public static Result<V, E> Success(V value) => new SuccessResult(value);
    public static Result<V, E> Failure(E error) => new FailureResult(error);
}