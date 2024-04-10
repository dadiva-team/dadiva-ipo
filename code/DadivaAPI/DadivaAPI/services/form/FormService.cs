using DadivaAPI.domain;
using DadivaAPI.repositories.form;
using DadivaAPI.services.form.dtos;
using DadivaAPI.utils;

namespace DadivaAPI.services.form;

public class FormService(IFormRepository repository) : IFormService
{
    public async Task<Result<FormExternalInfo, Problem>> GetForm()
    {
        List<Question> questions = await repository.GetQuestions();

        return Result<FormExternalInfo, Problem>.Success(new FormExternalInfo(questions));
    }
}