import {User} from "../models/User";
import {UpdateUserData, UsersList, MoviesInFavsDtoOut, UserWithReviewsDtoOut} from "../../interfaces/Interfaces";

export interface IUserRepository {
    register(user: User): Promise<string>;

    update(userId: number, userData: UpdateUserData): Promise<string>;

    login(userName: string, password: string): Promise<string>;

    delete(userName: string): Promise<string>;

    get(userName: string, auth_token: string): Promise<UserWithReviewsDtoOut>;

    sendRecoveryEmail(email: string): Promise<string>;

    recoverPassword(password: string, token: string): Promise<string>;

    updateUserImage(image: Buffer, userId: number): Promise<string>;

    search(query: string): Promise<UsersList[]>;

    getAllFavorites(userName: string): Promise<MoviesInFavsDtoOut[]>;
}