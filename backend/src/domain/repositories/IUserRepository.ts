import {UserEntity} from "../../infrastructure/entities/UserEntity";

export interface IUserRepository {
    delete(userName: string): Promise<string>;
    get(userName: string): Promise<UserEntity>;
}