using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using FluentResults;
using User = DadivaAPI.domain.user.User;

namespace DadivaAPI.services.form;

public interface IFormService
{
    public Task<Result<GetFormOutputModel>> GetForm();
    public Task<Result<SubmitFormOutputModel>> SubmitForm(Dictionary<string,IAnswer> answers, int nic, int formVersion);
    public Task<Result<Inconsistencies>> GetInconsistencies();
    public Task<Result<bool>> EditInconsistencies(Inconsistencies inconsistencies);
}