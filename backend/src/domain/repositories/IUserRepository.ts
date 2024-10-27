import {User} from "../models/User";
import {UpdateUserData, UserWithProfileInfo} from "../../interfaces/Interfaces";

export interface IUserRepository {
    register(user: User): Promise<string>;

    update(userId: number, userData: UpdateUserData): Promise<string>;

    login(user: User): Promise<string>;

    delete(userName: string): Promise<string>;

    get(userName: string, auth_token: string): Promise<UserWithProfileInfo>;
}