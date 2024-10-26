import {User} from "../models/User";
import {UpdateUserData} from "../../interfaces/Interfaces";

export interface IUserRepository {
    register(user: User): Promise<string>;

    update(userId: number, userData: UpdateUserData): Promise<string>;

    delete(userName: string): Promise<string>;

    get(userName: string): Promise<User>;
}