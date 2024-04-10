import { get } from '../utils/fetch';
import { getFormUri } from '../utils/WebApiUris';

export async function getForm() {
  return await get(getFormUri);
}
