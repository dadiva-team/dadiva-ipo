import {get, post} from '../utils/fetch';
import {
    getSubmissionByUserUri,
    getSubmissionsHistoryByUserUri,
    getUserByNicUri,
    getUsersUri, getUserSuspensionByNicUri, notesFromReviewUri,
    reviewSubmissionUri, suspendUserUri
} from "../utils/WebApiUris";
import {SubmissionOutputModel} from "./models/GetSubmissionsOutputModel";
import {ReviewFormRequestModel} from "./models/ReviewFormRequestModel";
import {GetUserByNicOutputModel} from "./models/GetUserByNicOutputModel";
import {SubmissionHistoryOutputModel} from "./models/SubmissionHistoryOutputModel";
import {NotesFromReviewOutputModel} from "./models/NotesFromReviewOutputModel";
import {SuspendUserRequestModel} from "./models/SuspendeUserRequestModel";
import {UserSuspension} from "../../domain/User/UserSuspension";

export namespace DoctorServices {
    export async function getUsers(): Promise<{ nic: number }[]> {
        return await get(getUsersUri);
    }

    export async function getUserByNic(nic: number): Promise<GetUserByNicOutputModel> {
        return await get(getUserByNicUri(nic));
    }

    export async function getPendingSubmissionByNic(nic: number): Promise<SubmissionOutputModel> {
        return await get(getSubmissionByUserUri(nic));
    }

    export async function getSubmissionHistoryByNic(nic: number, limit: number, skip: number): Promise<SubmissionHistoryOutputModel> {
        console.log(getSubmissionsHistoryByUserUri(nic, skip, limit));
        console.log("Requested getSubmissionHistoryByNic")
        return await get(getSubmissionsHistoryByUserUri(nic, skip, limit));
    }

    export async function getNotesFromReview(reviewId: number): Promise<NotesFromReviewOutputModel> {
        return await get(notesFromReviewUri(reviewId));
    }

    export async function suspendUser(requestBody: SuspendUserRequestModel ): Promise<boolean> {
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
