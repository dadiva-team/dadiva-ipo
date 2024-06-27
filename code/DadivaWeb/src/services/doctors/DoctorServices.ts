import {get, post} from '../utils/fetch';
import {getSubmissionsByUserUri, getUsersUri, reviewSubmissionUri} from "../utils/WebApiUris";
import {SubmissionOutputModel} from "./models/GetSubmissionsOutputModel";
import {ReviewFormOutputModel} from "./models/ReviewFormOutputModel";

export namespace DoctorServices {
    export async function getUsers(): Promise<{ nic: number }[]> {
        return await get(getUsersUri);
    }

    export async function getSubmissionByNic(nic: number): Promise<SubmissionOutputModel> {
        return await get(getSubmissionsByUserUri(nic));
    }

    export async function getSubmissionsByNic(nic: number): Promise<SubmissionOutputModel[]> {
        return await get(getSubmissionsByUserUri(nic));
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
