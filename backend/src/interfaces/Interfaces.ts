import {Movie} from "../domain/models/Movie";
import {MovieEntity} from "../infrastructure/entities/MovieEntity";

export interface UpdateUserData {
    userName?: string;
    password?: string;
    gender?: string;
    description?: string;
    email?: string;
    image?: any;
}

export interface UserWithProfileInfo {
    user: UserDtoOut;
    isOwnProfile: boolean;
}

export interface UserDtoOut {
    id: number;
    userName: string;
    email: string;
    birthDate: Date;
    password: string;
    gender: string;
    description: string | null;
    isAdmin: boolean;
    image: string | null;
}

export interface MovieReviewDtoOut {
    totalReview: number;
    score: number;
}

export interface UsersList {
    userName: string;
    description: string;
}

export interface MoviesList {
    title: string;
    premiereDate: Date;
    genres: string[];
    directors: string[];
    image: string | null;
}

export interface ReviewDtoIn {
    title: string;
    review: string;
    author: number;
    movie: number;
}