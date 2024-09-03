using DadivaAPI.services.form;
using DadivaAPI.services.reviews;
using DadivaAPI.services.submissions;
using DadivaAPI.services.terms;
using DadivaAPI.services.users;
using FluentResults;
using Microsoft.AspNetCore.Mvc;

namespace DadivaAPI.routes.utils;

public static class HttpExtensions
{
    private const string BaseUrl = "http://localhost:8000";

    public static IResult HandleRequest<TIn>(
        this Result<TIn> result, Func<TIn, IResult> onSuccess)
    {
        return result.IsSuccess
            ? onSuccess(result.Value)
            : Results.Problem(ErrorToProblem(result.Errors.FirstOrDefault()));
    }

    public static IResult HandleRequest(
        this Result result, Func<IResult> onSuccess)
    {
        return result.IsSuccess
            ? onSuccess()
            : Results.Problem(ErrorToProblem(result.Errors.FirstOrDefault()));
    }


    private static ProblemDetails ErrorToProblem(IError? error)
    {
        if (error == null)
        {
            return new ProblemDetails
            {
                Type = $"{BaseUrl}/probs/unknown",
                Title = "Erro desconhecido",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "Ocorreu um erro desconhecido. Por favor, tente novamente mais tarde."
            };
        }

        switch (error)
        {
            // Form Errors
            case FormErrors.NoFormError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/no-form",
                    Title = "Formulário não encontrado",
                    Status = StatusCodes.Status404NotFound,
                    Detail = "O formulário solicitado não foi encontrado."
                };
            case FormErrors.InvalidLanguageError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/invalid-language",
                    Title = "Idioma inválido",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "O idioma fornecido não é suportado."
                };
            case FormErrors.UnknownError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/unknown",
                    Title = "Erro desconhecido",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "Ocorreu um erro desconhecido. Por favor, tente novamente mais tarde."
                };
            case FormErrors.NoInconsistenciesError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/no-inconsistencies",
                    Title = "Inconsistências não encontradas",
                    Status = StatusCodes.Status404NotFound,
                    Detail = "Não foram encontradas inconsistências para o formulário fornecido."
                };

            // Submission Errors
            case SubmissionErrors.InvalidLanguageErrors:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/submission-invalid-language",
                    Title = "Idioma inválido na submissão",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "O idioma fornecido para a submissão não é suportado."
                };
            case SubmissionErrors.SubmissionNotSavedErrors:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/submission-not-saved",
                    Title = "Submissão não foi salva",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "A submissão não pôde ser salva. Tente novamente mais tarde."
                };
            case SubmissionErrors.SubmissionNotUpdatedErrors:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/submission-not-updated",
                    Title = "Submissão não foi atualizada",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "A submissão não pôde ser atualizada. Tente novamente mais tarde."
                };
            case SubmissionErrors.NoPendingSubmissionsErrors:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/no-pending-submissions",
                    Title = "Nenhuma submissão pendente",
                    Status = StatusCodes.Status404NotFound,
                    Detail = "Não foram encontradas submissões pendentes."
                };
            case SubmissionErrors.NoSubmissionsHistoryErrors:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/no-submission-history",
                    Title = "Histórico de submissões não encontrado",
                    Status = StatusCodes.Status404NotFound,
                    Detail = "Não foram encontradas submissões no histórico."
                };
            case SubmissionErrors.SubmissionNotFoundErrors:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/submission-not-found",
                    Title = "Submissão não encontrada",
                    Status = StatusCodes.Status404NotFound,
                    Detail = "A submissão especificada não foi encontrada."
                };
            case SubmissionErrors.AlreadyLockedByAnotherDoctor lockedError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/already-locked-by-another-doctor",
                    Title = "Submissão bloqueada por outro médico",
                    Status = StatusCodes.Status403Forbidden,
                    Detail = $"A submissão já está bloqueada pelo médico {lockedError.Message}."
                };
            case SubmissionErrors.NotYourSubmissionToUnlock unlockError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/not-your-submission-to-unlock",
                    Title = "Submissão não é sua para desbloquear",
                    Status = StatusCodes.Status403Forbidden,
                    Detail =
                        $"A submissão está bloqueada pelo médico {unlockError.Message}. Não é possível desbloqueá-la."
                };
            case SubmissionErrors.InvalidStatusErrors:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/invalid-status",
                    Title = "Estado inválido",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "O estado fornecido para a submissão é inválido."
                };
            case SubmissionErrors.SubmissionNotPendingStatusErrors:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/submission-not-pending",
                    Title = "Submissão não está pendente",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "A submissão não está no estado pendente."
                };
            case SubmissionErrors.SubmissionNotLockedErrors:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/submission-not-locked",
                    Title = "Submissão não está bloqueada",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "A submissão não está bloqueada e, portanto, não pode ser desbloqueada."
                };
            case SubmissionErrors.SubmissionNotLockedTimeoutErrors timeoutError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/submission-not-locked-timeout",
                    Title = "Submissão não bloqueada por timeout",
                    Status = StatusCodes.Status400BadRequest,
                    Detail =
                        $"As submissões com os seguintes IDs não foram bloqueadas por timeout: {string.Join(", ", timeoutError.Message)}"
                };
            case SubmissionErrors.InvalidDoctorNotesErrors:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/invalid-doctor-notes",
                    Title = "Notas do médico inválidas",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "As notas fornecidas pelo médico são inválidas."
                };

            // Review Errors
            case ReviewErrors.ReviewNotSavedError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/review-not-saved",
                    Title = "Revisão não salva",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "A revisão não pôde ser salva. Tente novamente mais tarde."
                };

            // User Errors
            case UserError.TokenCreationError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/token-creation-error",
                    Title = "Erro na criação do token",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "Ocorreu um erro ao tentar criar o token."
                };
            case UserError.UnknownDonorError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/unknown-donor",
                    Title = "Doador desconhecido",
                    Status = StatusCodes.Status404NotFound,
                    Detail = "O doador especificado não foi encontrado."
                };
            case UserError.UnknownDoctorError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/unknown-doctor",
                    Title = "Médico desconhecido",
                    Status = StatusCodes.Status404NotFound,
                    Detail = "O médico especificado não foi encontrado."
                };
            case UserError.UnknownAdminError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/unknown-admin",
                    Title = "Administrador desconhecido",
                    Status = StatusCodes.Status404NotFound,
                    Detail = "O administrador especificado não foi encontrado."
                };
            case UserError.SuspendedDonorError suspendedDonorError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/suspended-donor",
                    Title = "Doador suspenso",
                    Status = StatusCodes.Status403Forbidden,
                    Detail = suspendedDonorError.Message ?? "O doador foi suspenso."
                };
            case UserError.InvalidSuspensionTypeError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/invalid-suspension-type",
                    Title = "Tipo de suspensão inválido",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "O tipo de suspensão fornecido é inválido."
                };
            case UserError.UserHasNoSuspensionError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/user-has-no-suspension",
                    Title = "Usuário sem suspensão",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "O usuário não possui nenhuma suspensão."
                };
            case UserError.SuspensionNotDeletedError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/suspension-not-deleted",
                    Title = "Suspensão não deletada",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "Ocorreu um erro ao tentar deletar a suspensão."
                };
            case UserError.InvalidEndDateTypeError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/invalid-end-date-type",
                    Title = "Tipo de data final inválido",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "O tipo de data final fornecido é inválido."
                };
            case UserError.InvalidRoleError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/invalid-role",
                    Title = "Papel inválido",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "O papel fornecido é inválido."
                };
            case UserError.UnknownError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/unknown-error",
                    Title = "Erro desconhecido",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "Ocorreu um erro desconhecido. Por favor, tente novamente mais tarde."
                };


            // Terms Errors
            case TermsErrors.InvalidLanguageError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/terms-invalid-language",
                    Title = "Idioma inválido nos termos",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "O idioma fornecido para os termos não é suportado."
                };
            case TermsErrors.NoTermsError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/no-terms",
                    Title = "Termos não encontrados",
                    Status = StatusCodes.Status404NotFound,
                    Detail = "Os termos solicitados não foram encontrados."
                };
            case TermsErrors.UnknownTermsError:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/unknown-terms",
                    Title = "Erro desconhecido nos termos",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "Ocorreu um erro desconhecido ao processar os termos."
                };

            // Default case for unknown errors
            default:
                return new ProblemDetails
                {
                    Type = $"{BaseUrl}/probs/generic-error",
                    Title = "Ocorreu um erro",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "Ocorreu um erro ao processar o seu pedido."
                };
        }
    }
}