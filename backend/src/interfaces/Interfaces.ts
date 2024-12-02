import {Movie} from "../domain/models/Movie";

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

export interface AuthorDtoOut {
    id: number;
    userName: string;
    image: string | null;
}

export interface ReviewDtoOut {
    title: string;
    content: string;
    author: AuthorDtoOut;
}

export interface MovieWithReviewsDtoOut {
    movie: Movie;
    reviews: ReviewDtoOut[];
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

export interface MoviesInFavsDtoOut {
    id: number;
    title: string;
    image: string | null;
}

export interface ReviewDtoIn {
    title: string;
    review: string;
    author: number;
    movie: number;
}