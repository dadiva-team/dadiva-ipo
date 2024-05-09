import { get } from '../utils/fetch';
import { getFormUri } from '../utils/WebApiUris';
import { FormOutputModel } from './models/FormOutputModel';

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

export namespace FormServices {
  export async function getForm(): Promise<FormOutputModel> {
    return convertKeysToCamelCase(await get<FormOutputModel>(getFormUri));
  }
}

//export async function submitForm(): Promise<FormSubmitModel> {}
