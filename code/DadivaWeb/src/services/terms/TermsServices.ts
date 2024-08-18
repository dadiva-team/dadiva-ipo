import { get, put } from '../utils/fetch';
import { getActiveTermsUri, getTermsUri, updateTermsUri } from '../utils/WebApiUris';
import { Terms } from '../../domain/Terms/Terms';
import { UpdateTermsOutputModel } from './models/UpdateTermsOutputModel';

export namespace TermsServices {
  export async function getTerms(): Promise<Terms[]> {
    try {
      const res = await get<Terms[]>(getTermsUri);
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

  export async function updateTerms(termId: number, submission: UpdateTermsOutputModel): Promise<boolean> {
    try {
      console.log('Submitting terms|||||||||||||||');
      console.log(submission.updatedBy);
      console.log(submission.newContent);
      console.log(JSON.stringify(submission));
      await put<boolean>(updateTermsUri(termId), JSON.stringify(submission));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
