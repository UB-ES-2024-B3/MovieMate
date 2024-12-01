import {inject, injectable} from "tsyringe";
import {IReviewRepository} from "../../domain/repositories/IReviewRepository";
import {ReviewDtoIn} from "../../interfaces/Interfaces"
import {Review} from "../../domain/models/Review";

@injectable()
export class ReviewService {
    constructor(@inject("IReviewRepository") private ReviewRepository: IReviewRepository) {
    }

    async createReview(review: ReviewDtoIn): Promise<string> {
        return await this.ReviewRepository.create(review);
    }

    async getReview(reviewId: number): Promise<ReviewDtoIn> {
        return await this.ReviewRepository.get(reviewId);
    }

    async getAllReviews(): Promise<ReviewDtoIn[]> {
        return await this.ReviewRepository.getAll();
    }
}