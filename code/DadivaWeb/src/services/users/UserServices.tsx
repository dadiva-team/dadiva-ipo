import { post } from "../utils/fetch";
import {createToken, createUser} from "../utils/WebApiUris"

export async function loginNIC(
    nic: string,
    password: string
){
    return await post(
        createToken,
        JSON.stringify({"nic": nic, "password": password})
    )
}

export async function register(
    nic: string,
    password: string
){
    return await post(
        createUser,
        JSON.stringify({"nic": nic, "password": password})
    )
}