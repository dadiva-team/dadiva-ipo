import { get, post } from '../utils/fetch';
import { getActiveTermsUri, getTermsHistoryUri, updateTermsUri } from '../utils/WebApiUris';
import { Terms } from '../../domain/Terms/Terms';
import { UpdateTermsOutputModel } from './models/UpdateTermsOutputModel';
import { TermsHistoryOutputModel } from './models/TermsHistoryOutputModel';

export namespace TermsServices {
  export async function getTerms(language: string): Promise<TermsHistoryOutputModel> {
    try {
      const res = await get<TermsHistoryOutputModel>(getTermsHistoryUri(language));
      console.log('TermServices getTerms res: ' + res);
      return res;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  export async function getActiveTerms(language: string): Promise<Terms> {
    try {
      const res = await get<Terms>(getActiveTermsUri(language));
      console.log('TermServices getActiveTerms res: ' + res.content);
      return res;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  export async function updateTerms(submission: UpdateTermsOutputModel): Promise<boolean> {
    try {
      console.log('Submitting terms|||||||||||||||');
      console.log(JSON.stringify(submission));
      await post<boolean>(updateTermsUri, JSON.stringify(submission));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
