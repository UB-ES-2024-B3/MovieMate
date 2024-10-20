import {User} from "../models/User";

export interface IUserRepository {
    register(userData: { name: string, email: string, birthDate: Date, password: string, gender: string}): Promise<string>;
    delete(userName: string): Promise<string>;
    get(userName: string): Promise<User>;
}