import {Review} from "../models/Review"
import {ReviewDtoIn, ReviewDtoOut} from "../../interfaces/Interfaces";

export interface IReviewRepository {
    create(review: ReviewDtoIn): Promise<string>;
    get(reviewId: number): Promise<ReviewDtoOut>;
    getAll(): Promise<ReviewDtoOut[]>;
    addLike(userName: string, idReview: number): Promise<string>;
    addDislike(userName: string, idReview: number): Promise<string>;
    deleteReview(reviewId: number): Promise<string>;
}