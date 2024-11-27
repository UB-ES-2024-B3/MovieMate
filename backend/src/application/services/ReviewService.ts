import {Review} from "../../domain/models/Review";
import {inject, injectable} from "tsyringe";
import {IReviewRepository} from "../../domain/repositories/IReviewRepository";

@injectable()
export class ReviewService {
    constructor(@inject("IReviewRepository") private ReviewRepository: IReviewRepository) {
    }

    async createReview(review: Review): Promise<string> {
        return await this.ReviewRepository.create(review);
    }
}