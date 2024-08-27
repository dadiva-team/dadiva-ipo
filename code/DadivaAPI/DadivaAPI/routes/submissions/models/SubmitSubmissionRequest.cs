using DadivaAPI.routes.form.models;

namespace DadivaAPI.routes.submissions.models;

public record SubmitSubmissionRequest(
    string FormLanguage,
    List<AnsweredQuestionModel> AnsweredQuestions
);

