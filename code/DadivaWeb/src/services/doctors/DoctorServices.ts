import { get, post } from '../utils/fetch';
import {
  getPendingSubmissionsUri,
  getSubmissionByUserUri,
  getSubmissionHistoryByUserUri,
  getUserByNicUri,
  getUsersUri,
  getUserSuspensionByNicUri,
  lockSubmissionUri,
  notesFromReviewUri,
  reviewSubmissionUri,
  suspendUserUri,
  unlockSubmissionUri,
} from '../utils/WebApiUris';
import { SubmissionModel } from './models/SubmissionOutputModel';
import { ReviewFormRequestModel } from './models/ReviewFormRequestModel';
import { GetUserByNicOutputModel } from './models/GetUserByNicOutputModel';
import { SubmissionHistoryOutputModel } from './models/SubmissionHistoryOutputModel';
import { NotesFromReviewOutputModel } from './models/NotesFromReviewOutputModel';
import { SuspendUserRequestModel } from './models/SuspendeUserRequestModel';
import { UserSuspension } from '../../domain/User/UserSuspension';
import { GetSubmissionsOutputModel } from './models/GetSubmissionsOutputModel';
import { SubmissionUnlockRequestModel } from './models/SubmissionUnlockRequestModel';

export namespace DoctorServices {
  export async function getUsers(): Promise<{ nic: number }[]> {
    return await get(getUsersUri);
  }

  export async function getUserByNic(nic: number): Promise<GetUserByNicOutputModel> {
    return await get(getUserByNicUri(nic));
  }

  export async function getPendingSubmissionByNic(nic: string): Promise<SubmissionModel> {
    return await get(getSubmissionByUserUri(nic));
  }

  export async function getReviewsHistoryByUserNIC(
    nic: number,
    limit: number,
    skip: number
  ): Promise<SubmissionHistoryOutputModel> {
    console.log(getSubmissionHistoryByUserUri(nic, skip, limit));
    console.log('Requested getSubmissionHistoryByNic');
    return await get(getSubmissionHistoryByUserUri(nic, skip, limit));
  }

  export async function getPendingSubmissions(): Promise<GetSubmissionsOutputModel> {
    return await get(getPendingSubmissionsUri);
  }

  export async function lockSubmission(submissionId: number): Promise<void> {
    await post(lockSubmissionUri(submissionId));
  }

  export async function unlockSubmission(submissionId: number, doctorId: number): Promise<void> {
    const body = { doctorId: doctorId } as SubmissionUnlockRequestModel;
    await post(unlockSubmissionUri(submissionId), JSON.stringify(body));
  }

  export async function getNotesFromReview(reviewId: number): Promise<NotesFromReviewOutputModel> {
    return await get(notesFromReviewUri(reviewId));
  }

  export async function suspendUser(requestBody: SuspendUserRequestModel): Promise<boolean> {
    try {
      console.log(JSON.stringify(requestBody));
      await post(suspendUserUri, JSON.stringify(requestBody));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  export async function getDonorSuspension(nic: number): Promise<UserSuspension> {
    return await get(getUserSuspensionByNicUri(nic));
  }

  export async function reviewSubmission(sumbission: number, requestBody: ReviewFormRequestModel): Promise<boolean> {
    try {
      console.log(JSON.stringify(requestBody));
      console.log(reviewSubmissionUri(sumbission));

      await post(reviewSubmissionUri(sumbission), JSON.stringify(requestBody));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
