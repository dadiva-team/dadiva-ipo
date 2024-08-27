import { get, post, put } from '../utils/fetch';
import {
  editFormUri,
  editInconsistenciesUri,
  getFormUri,
  getInconsistenciesUri,
  submitFormUri,
} from '../utils/WebApiUris';
import { DomainToRules, FormOutputModel, ModelToDomain, RulesToDomain } from './models/FormOutputModel';
import { Form } from '../../domain/Form/Form';
import { RuleProperties } from 'json-rules-engine';
import { InconsistenciesOutputModel } from './models/InconsistenciesOutputModel';
import { SubmitFormOutputModel } from './models/SubmitFormOutputModel';
import { AnsweredQuestionModel } from './models/AnsweredQuestionModel';
import { SubmitFormRequest } from './models/SubmitFormRequest';
import {
  FormWithVersionDomainModel,
  FormWithVersionModelToDomain,
  FormWithVersionOutputModel,
} from './models/FormWithVersionOutputModel';
import { EditFormRequest } from './models/EditFormRequest';

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

function convertKeysToCamelCase<T>(obj: T): ConvertKeysToCamelCase<T> {
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

function transformFormAnswers(formAnswers: Record<string, string>[]): AnsweredQuestionModel[] {
  console.log('TRANSFORM FORM ANSWERS |||||||||||||||');
  const answeredQuestions: AnsweredQuestionModel[] = [];

  formAnswers.forEach(answer => {
    Object.keys(answer).forEach(questionId => {
      answeredQuestions.push({
        questionId,
        answer: answer[questionId],
      });
    });
  });

  return answeredQuestions;
}

export namespace FormServices {
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

  export async function getFormByVersion(formVersion: number): Promise<FormWithVersionDomainModel> {
    console.log('GET FORM BY VERSION |||||||||||||||');
    const res = await get<FormWithVersionOutputModel>(getFormUri + `/${formVersion}`);

    console.log(FormWithVersionModelToDomain(res));
    return FormWithVersionModelToDomain(res);
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

  export async function saveInconsistencies(inconsistencies: RuleProperties[]): Promise<boolean> {
    try {
      console.log(JSON.stringify({ inconsistencies: DomainToRules(inconsistencies) }));
      console.log('WEWWEWEWEWEWEWEWWWWWWWWWWWWWWWWWWWWWWWWWww');
      await put(editInconsistenciesUri, JSON.stringify({ inconsistencies: DomainToRules(inconsistencies) }));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  export async function submitForm(
    formAnswers: Record<string, string>[],
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
