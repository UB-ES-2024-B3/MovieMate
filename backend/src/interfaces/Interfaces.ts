import {User} from "../domain/models/User";

export interface UpdateUserData {
    userName?: string;
    password?: string;
    gender?: string;
    description?: string;
    email?: string;
}

export interface UserWithProfileInfo {
    user: User;
    isOwnProfile: boolean;
}

export interface UsersList {
    userName: string;
    description: string;
}