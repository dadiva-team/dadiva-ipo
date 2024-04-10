using DadivaAPI.services.form.dtos;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public interface IFormService
{
    public Task<Result<FormExternalInfo, Problem>> GetForm();
}