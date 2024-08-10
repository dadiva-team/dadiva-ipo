using DadivaAPI.domain;
using FluentResults;

namespace DadivaAPI.services.manual;

public interface IManualService
{
    public Task<Result<List<ManualEntry>>> GetManualInformation(string productName);
}