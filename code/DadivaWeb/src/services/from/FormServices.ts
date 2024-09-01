import { get, post, put } from '../utils/fetch';
import {
  editFormUri,
  editInconsistenciesUri,
  getFormUri,
  getInconsistenciesUri,
  getSubmissionsStatsUri,
  submitFormUri,
} from '../utils/WebApiUris';
import { DomainToRules, FormOutputModel, ModelToDomain, RulesToDomain } from './models/FormOutputModel';
import { Form } from '../../domain/Form/Form';
import { RuleProperties } from 'json-rules-engine';
import { InconsistenciesOutputModel } from './models/InconsistenciesOutputModel';
import { SubmitFormOutputModel } from './models/SubmitFormOutputModel';
import { AnsweredQuestionModel } from './models/AnsweredQuestionModel';
import { SubmitFormRequest } from './models/SubmitFormRequest';
import { EditFormRequest } from './models/EditFormRequest';
import { SubmissionStats } from '../../components/backoffice/statistics/StatsPage';
import { Answer } from '../../components/form/utils/formUtils';
import { EditInconsistenciesRequest } from './models/EditInconsistenciesRequest';

function toCamelCase(s: string): string {
  return s.replace(/([A-Z])/g, (c, first) => (first ? c.toLowerCase() : c));
}

type CamelCase<S extends string> = S extends `${infer P1}${infer P2}`
  ? P1 extends Uppercase<P1>
    ? `${Lowercase<P1>}${CamelCase<P2>}`
    : `${P1}${CamelCase<P2>}`
  : S;

type ConvertKeysToCamelCase<T> = T extends object
  ? T extends Array<infer U> // Special handling for arrays
    ? Array<ConvertKeysToCamelCase<U>>
    : { [K in keyof T as CamelCase<string & K>]: ConvertKeysToCamelCase<T[K]> }
  : T;

export function convertKeysToCamelCase<T>(obj: T): ConvertKeysToCamelCase<T> {
  if (typeof obj !== 'object' || obj === null) {
    return obj as ConvertKeysToCamelCase<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase) as ConvertKeysToCamelCase<T>;
  }

  const newObj: Record<string, unknown> = {};
  Object.keys(obj).forEach(key => {
    const val = (obj as Record<string, unknown>)[key];
    newObj[toCamelCase(key)] = convertKeysToCamelCase(val);
  });

  return newObj as ConvertKeysToCamelCase<T>;
}

function transformFormAnswers(formAnswers: Record<string, Answer>[]): AnsweredQuestionModel[] {
  console.log('TRANSFORM FORM ANSWERS |||||||||||||||');
  const answeredQuestions: AnsweredQuestionModel[] = [];

  formAnswers.forEach(answer => {
    Object.keys(answer).forEach(questionId => {
      const answerValue = answer[questionId].value;
      const transformedAnswer = {
        questionId,
        answer: answerValue,
      };

      answeredQuestions.push(transformedAnswer);
    });
  });
  return answeredQuestions;
}

export namespace FormServices {
  export async function getSubmissionsStats(start?: number, end?: number): Promise<SubmissionStats> {
    const queries = !start && !end ? '' : '?' + (start ? `unixStart=${start}&` : '') + (end ? `unixEnd=${end}` : '');
    const res = await get<SubmissionStats>(getSubmissionsStatsUri + queries);
    console.log(res);
    return res;
  }

  export async function getForm(language: string): Promise<Form> {
    console.log('getForm with language: ' + language);
    console.log('GET FORM |||||||||||||||');
    const res = await get<FormOutputModel>(getFormUri(language));
    const convertedRes = convertKeysToCamelCase(res);
    console.log('converted ', convertedRes);

    const formOutput: FormOutputModel = {
      ...convertedRes,
    };
    console.log(ModelToDomain(formOutput));
    return ModelToDomain(formOutput);
  }

  export async function editForm(form: Form, reason: string): Promise<boolean> {
    console.log('SAVE FORM |||||||||||||||');
    console.log(form);
    const convertedForm = convertKeysToCamelCase<Form>(form);

    const request = {
      language: form.language,
      groups: convertedForm.groups,
      rules: convertedForm.rules,
      reason: reason,
    } as EditFormRequest;
    console.log(request);

    await put(editFormUri, JSON.stringify(request));
    return true;
  }

  export async function getInconsistencies(): Promise<RuleProperties[]> {
    const res = await get<InconsistenciesOutputModel>(getInconsistenciesUri);
    return RulesToDomain(convertKeysToCamelCase(res.inconsistencies));
  }

  export async function saveInconsistencies(
    inconsistencies: RuleProperties[],
    language: string,
    reason: string
  ): Promise<boolean> {
    console.log(JSON.stringify({ inconsistencies: DomainToRules(inconsistencies) }));

    const request = {
      language: language,
      inconsistencies: DomainToRules(inconsistencies),
      reason: reason,
    } as EditInconsistenciesRequest;

    console.log('request', request);

    await put(editInconsistenciesUri, JSON.stringify(request));
    return true;
  }

  export async function submitForm(
    formAnswers: Record<string, Answer>[],
    formLanguage: string
  ): Promise<SubmitFormOutputModel> {
    try {
      const answeredQuestions = transformFormAnswers(formAnswers);
      console.log('SUBMIT FORM |||||||||||||||');

      const body: SubmitFormRequest = {
        formLanguage,
        answeredQuestions,
      };
      console.log(JSON.stringify(body));
      return await post(submitFormUri, JSON.stringify(body));
    } catch (e) {
      console.error(e);
    }
  }
}
