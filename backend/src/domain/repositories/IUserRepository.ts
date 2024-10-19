import {User} from "../models/User";

export interface IUserRepository {
    delete(userName: string): Promise<string>;
    get(userName: string): Promise<User>;
}