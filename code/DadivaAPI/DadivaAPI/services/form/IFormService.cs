using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using FluentResults;
using User = DadivaAPI.domain.user.User;

namespace DadivaAPI.services.form;

public interface IFormService
{
    public Task<Result<GetFormOutputModel>> GetForm(string language);

    public Task<Result> AddForm(
        List<QuestionGroupModel> questionGroups,
        List<RuleModel> rules,
        string language,
        string? reason,
        string nic
    );

    public Task<Result<GetInconsistenciesOutputModel>> GetInconsistencies();
    public Task<Result> EditInconsistencies(
        List<RuleModel> inconsistencies,
        string nic,
        string language,
        string? reason
    );
}