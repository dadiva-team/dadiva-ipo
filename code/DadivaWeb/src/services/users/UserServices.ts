import { post } from '../utils/fetch';
import { createTokenUri, createUserUri } from '../utils/WebApiUris';

export async function loginNIC(nic: string, password: string) {
  return await post(createTokenUri, JSON.stringify({ nic: nic, password: password }));
}

export async function register(nic: string, password: string) {
  return await post(createUserUri, JSON.stringify({ nic: nic, password: password }));
}
