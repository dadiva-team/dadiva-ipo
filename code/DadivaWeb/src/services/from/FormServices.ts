import { get, post, put } from '../utils/fetch';
import {
  editFormUri,
  editInconsistenciesUri,
  getFormUri,
  getInconsistenciesUri,
  submitFormUri,
} from '../utils/WebApiUris';
import { DomainToModel, DomainToRules, FormOutputModel, ModelToDomain, RulesToDomain } from './models/FormOutputModel';
import { Form } from '../../domain/Form/Form';
import { RuleProperties } from 'json-rules-engine';
import { InconsistenciesOutputModel } from './models/InconsistenciesOutputModel';

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

function transformFormAnswers(formAnswers: Record<string, string>[]): {
  answeredQuestions: Array<{ questionId: string; answer: string }>;
} {
  console.log(formAnswers);
  console.log('TRANSFORM FORM ANSWERS |||||||||||||||');
  const answeredQuestions: { questionId: string; answer: string }[] = [];

  formAnswers.forEach(answer => {
    Object.keys(answer).forEach(questionId => {
      answeredQuestions.push({
        questionId,
        answer: answer[questionId],
      });
    });
  });

  return { answeredQuestions };
}

export namespace FormServices {
  export async function getForm(): Promise<Form> {
    console.log('GET FORM |||||||||||||||');
    const res = await get<FormOutputModel>(getFormUri);
    console.log(ModelToDomain(convertKeysToCamelCase(res)));
    return ModelToDomain(convertKeysToCamelCase(res));
  }

  export async function saveForm(form: Form): Promise<boolean> {
    console.log('SAVE FORM |||||||||||||||');
    console.log(DomainToModel(form));
    console.log(JSON.stringify(DomainToModel(form)));
    await put(editFormUri, JSON.stringify(DomainToModel(form)));
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

  export async function submitForm(nic: number, formAnswers: Record<string, string>[]): Promise<boolean> {
    try {
      const answeredQuestions = transformFormAnswers(formAnswers);
      console.log(JSON.stringify(answeredQuestions));
      console.log('SUBMIT FORM |||||||||||||||');
      await post(submitFormUri(nic), JSON.stringify(answeredQuestions));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
