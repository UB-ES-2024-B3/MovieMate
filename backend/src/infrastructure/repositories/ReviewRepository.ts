import {ILike, Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IReviewRepository} from "../../domain/repositories/IReviewRepository";
import {ReviewEntity} from "../entities/ReviewEntity";
import {Review} from "../../domain/models/Review";

export class ReviewRepository implements IReviewRepository {
    private readonly repository: Repository<ReviewEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(ReviewEntity);
    }

    async create(review: Review): Promise<string> {

        // Save review using the repository
        await this.repository.save(review);

        // Return a success message or the new review ID
        return "Review Published";
    }
}
