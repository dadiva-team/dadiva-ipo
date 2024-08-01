using DadivaAPI.domain;
using DadivaAPI.utils;

namespace DadivaAPI.services.manual;

public interface IManualService
{
    public Task<Result<List<ManualEntry>, Problem>> GetManualInformation(string productName);
}