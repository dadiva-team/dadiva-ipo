import { get, put } from '../utils/fetch';
import { getTermsUri } from '../utils/WebApiUris';
import { Terms } from '../../domain/Terms/Terms';

export namespace TermsServices {
  export async function getTerms(): Promise<Terms> {
    try {
      const res = await get<Terms>(getTermsUri);
      console.log('TermServices getTerms res: ' + res);
      return res;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  export async function submitTerms(terms: Terms): Promise<boolean> {
    try {
      console.log('Submitting terms|||||||||||||||');
      await put<boolean>(getTermsUri, JSON.stringify(terms));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
