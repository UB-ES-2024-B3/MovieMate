import {inject, injectable} from "tsyringe";
import {IReviewRepository} from "../../domain/repositories/IReviewRepository";
import {ReviewDtoIn} from "../../interfaces/Interfaces";

@injectable()
export class ReviewService {
    constructor(@inject("IReviewRepository") private ReviewRepository: IReviewRepository) {
    }

    async createReview(review: ReviewDtoIn): Promise<string> {
        return await this.ReviewRepository.create(review);
    }
}