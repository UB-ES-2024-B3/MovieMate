import {Review} from "../models/Review"

export interface IReviewRepository {
    create(review: Review): Promise<string>;
}