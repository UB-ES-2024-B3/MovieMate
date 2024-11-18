import {User} from "../models/User";
import {UpdateUserData, UsersList, UserWithProfileInfo} from "../../interfaces/Interfaces";

export interface IUserRepository {
    register(user: User): Promise<string>;

    update(userId: number, userData: UpdateUserData): Promise<string>;

    login(userName: string, password: string): Promise<string>;

    delete(userName: string): Promise<string>;

    get(userName: string, auth_token: string): Promise<UserWithProfileInfo>;

    sendRecoveryEmail(email: string): Promise<string>;

    recoverPassword(password: string, token: string): Promise<string>;

    updateUserImage(image: Buffer, userId: number): Promise<string>;

    search(query: string): Promise<UsersList[]>;

}