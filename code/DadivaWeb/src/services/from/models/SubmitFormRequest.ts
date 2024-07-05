import {AnsweredQuestionModel} from "./AnsweredQuestionModel";

export interface SubmitFormRequest {
    answeredQuestions: AnsweredQuestionModel[];
    formVersion: number;
}