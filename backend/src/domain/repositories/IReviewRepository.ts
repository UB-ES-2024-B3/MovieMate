import {Review} from "../models/Review"
import {ReviewDtoIn} from "../../interfaces/Interfaces";

export interface IReviewRepository {
    create(review: ReviewDtoIn): Promise<string>;
}