import {inject, injectable} from "tsyringe";
import {IReviewRepository} from "../../domain/repositories/IReviewRepository";
import {ReviewDtoIn, ReviewDtoOut} from "../../interfaces/Interfaces"
import {Review} from "../../domain/models/Review";

@injectable()
export class ReviewService {
    constructor(@inject("IReviewRepository") private ReviewRepository: IReviewRepository) {
    }

    async createReview(review: ReviewDtoIn): Promise<string> {
        return await this.ReviewRepository.create(review);
    }

    async getReview(reviewId: number): Promise<ReviewDtoOut> {
        return await this.ReviewRepository.get(reviewId);
    }

    async getAllReviews(): Promise<ReviewDtoOut[]> {
        return await this.ReviewRepository.getAll();
    }

    async deleteReview(reviewId: number): Promise<string> {
        return await this.ReviewRepository.deleteReview(reviewId);
    }

    async addLike(userName: string, idReview: number): Promise<string>{
        return await this.ReviewRepository.addLike(userName, idReview);
    }

    async addDislike(userName: string, idReview: number): Promise<string>{
        return await this.ReviewRepository.addDislike(userName, idReview);
    }
}