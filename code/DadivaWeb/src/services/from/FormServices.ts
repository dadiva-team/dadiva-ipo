import { get } from '../utils/fetch';
import { getFormUri } from '../utils/WebApiUris';
import { FormOutputModel } from './models/FormOutputModel';

export async function getForm(): Promise<FormOutputModel> {
  return await get(getFormUri);
}

//export async function submitForm(): Promise<FormSubmitModel> {}
