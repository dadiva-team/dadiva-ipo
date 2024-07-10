import {get, post} from '../utils/fetch';
import {
    getSubmissionByUserUri,
    getSubmissionsHistoryByUserUri,
    getUserByNicUri,
    getUsersUri,
    reviewSubmissionUri
} from "../utils/WebApiUris";
import {SubmissionOutputModel} from "./models/GetSubmissionsOutputModel";
import {ReviewFormOutputModel} from "./models/ReviewFormOutputModel";
import {GetUserByNicOutputModel} from "./models/GetUserByNicOutputModel";
import {SubmissionHistoryOutputModel} from "./models/SubmissionHistoryOutputModel";

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

    export async function reviewSubmission(sumbission: number, outputModel: ReviewFormOutputModel): Promise<boolean> {
        try {
            console.log(JSON.stringify(outputModel));
            console.log(reviewSubmissionUri(sumbission));

            await post(reviewSubmissionUri(sumbission), JSON.stringify(outputModel));
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
