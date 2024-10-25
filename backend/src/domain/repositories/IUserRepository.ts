import {User} from "../models/User";
import {UserUpdateData} from "../../interfaces/UserUpdateData";

export interface IUserRepository {
    register(user: User): Promise<string>;
    update(userId: number, userData: UserUpdateData): Promise<string>;
    delete(userName: string): Promise<string>;
    get(userName: string): Promise<User>;
}