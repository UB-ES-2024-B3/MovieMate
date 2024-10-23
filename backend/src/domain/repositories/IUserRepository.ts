import {User} from "../models/User";

export interface IUserRepository {
    register(user: User): Promise<string>;
    login(user: User): Promise<string>;
    delete(userName: string): Promise<string>;
    get(userName: string): Promise<User>;
}