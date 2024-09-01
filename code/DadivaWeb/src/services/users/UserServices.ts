import { deleteRequest, get, post } from '../utils/fetch';
import { createTokenUri, createUserUri, deleteUserUri, getUsersUri } from '../utils/WebApiUris';
import { LoginOutputModel } from './models/LoginOutputModel';
import { RegisterResponseModel } from './models/RegisterResponseModel';

export async function loginNIC(nic: string, password: string): Promise<LoginOutputModel> {
  return await post<LoginOutputModel>(createTokenUri, JSON.stringify({ nic, password }));
}

export async function register(
  nic: string,
  password: string,
  name: string,
  role: string
): Promise<RegisterResponseModel> {
  console.log(role);
  return await post(
    createUserUri,
    JSON.stringify({ nic: nic, password: password, name: name, roles: [role.toLowerCase()] })
  );
}

export async function getUsers(): Promise<{ nics: number[] }> {
  return await get(getUsersUri);
}

export async function deleteUser(nic: string): Promise<boolean> {
  return await deleteRequest(deleteUserUri + nic);
}
