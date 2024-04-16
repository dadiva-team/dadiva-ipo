import { get } from '../utils/fetch';
import { getDrugsAndDiseases } from '../utils/WebApiUris';

export async function getDnD() {
  return await get(getDrugsAndDiseases);
}
