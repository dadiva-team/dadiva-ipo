import { deleteRequest, get, post } from '../utils/fetch';
import { createTokenUri, createUserUri, deleteUserUri, getUsersUri } from '../utils/WebApiUris';

export async function loginNIC(nic: string, password: string) {
  return await post(createTokenUri, JSON.stringify({ nic: nic, password: password }));
}

export async function register(nic: string, password: string) {
  return await post(createUserUri, JSON.stringify({ nic: nic, password: password }));
}

export async function getUsers(): Promise<{ nic: number }[]> {
  return await get(getUsersUri);
}

export async function deleteUser(nic: string): Promise<boolean> {
  return await deleteRequest(deleteUserUri + nic);
}
