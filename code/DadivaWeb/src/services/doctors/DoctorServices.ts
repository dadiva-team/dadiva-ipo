import {  get } from '../utils/fetch';
import { getSubmissionsByUserUri, getUsersUri } from "../utils/WebApiUris";
import { SubmissionOutputModel } from "./models/GetSubmissionsOutputModel";

export namespace DoctorServices {
  export async function getUsers(): Promise<{ nic: number }[]> {
    return await get(getUsersUri);
  }

  export async function getSubmissionByNic(nic: number): Promise<SubmissionOutputModel> {
    return await get(getSubmissionsByUserUri(nic));
  }
}
