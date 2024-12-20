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
    totalFollowers: number;
    totalFollowing: number;
}

export interface AuthorDtoOut {
    id: number;
    userName: string;
    image: string | null;
}

export interface MovieDtoOut {
    id: number;
    title: string;
    image: string | null;
}

export interface ReviewDtoOut {
    id: number;
    title: string;
    content: string;
    author?: AuthorDtoOut;
    movie?: MovieDtoOut;
    like: number;
    disLike: number;
    totalComments: number;
}

export interface MovieWithReviewsDtoOut {
    movie: Movie;
    reviews: ReviewDtoOut[];
}

export interface UserWithReviewsDtoOut {
    user: UserDtoOut;
    reviews: ReviewDtoOut[];
    isOwnProfile: boolean;
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
    like: number;
    disLike: number;
}

export interface PostDtoIn {
    title: string;
    post: string;
    author: string;
    image: Buffer | null;
    like: number;
    disLike: number;
}

export interface PostDtoOut {
    id: number;
    createdAt: Date;
    title: string;
    post: string;
    author?: AuthorDtoOut,
    image: string | null;
    like: number,
    disLike: number,
    totalComments: number
}

export interface UsersInfoDtoOut {
    user: UserDtoOut;
    reviews: ReviewDtoOut[];
    posts: PostDtoOut[];
    isOwnProfile: boolean;
}

export interface UpdatePostData {
    title?: string;
    post?: string;
}

export interface CommentDtoIn {
    content: string;
    author: string;
    post?: number;
    review?: number;
    comment?: number;
}

export interface CommentDtoOut {
    id: number;
    createdAt: Date;
    content: string;
    author: AuthorDtoOut;
    post?: number;
    review?: number;
    comment?: number;
    totalComments: number;
    like: number;
    disLike: number;
    likedBy: string[];
    dislikeBy: string[];
}

export interface UpdateCommentData {
    content: string
}

export interface UserId {
    id: number;
}

export interface Filters {
    genres?: string;
    directors?: string;
    actors?: string;
    premiereYear?: number;
    duration?: number;
    classification?: string;
    score?: number;
    totalReviews?: number;
}

export interface GetMoviesFilteredDtoOut {
    movies: MovieDtoOut[],
    paginationInfo: {
        moviesFound: number,
        actualPage?: number,
        totalPages?: number
    }
}