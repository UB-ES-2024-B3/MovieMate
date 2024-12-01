import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IReviewRepository} from "../../domain/repositories/IReviewRepository";
import {ReviewEntity} from "../entities/ReviewEntity";
import {ReviewDtoIn} from "../../interfaces/Interfaces";
import {MovieEntity} from "../entities/MovieEntity";
import {UserEntity} from "../entities/UserEntity";
import createError from "http-errors";
import {Review} from "../../domain/models/Review";
import {User} from "../../domain/models/User";

export class ReviewRepository implements IReviewRepository {
    private readonly repository: Repository<ReviewEntity>;
    private readonly movieRepo: Repository<MovieEntity>;
    private readonly userRepo: Repository<UserEntity>;


    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(ReviewEntity);
        this.movieRepo = PostgreTypeOrmDataSource.getRepository(MovieEntity);
        this.userRepo = PostgreTypeOrmDataSource.getRepository(UserEntity);
    }

    async create(review: ReviewDtoIn): Promise<string> {
        const movieFromDB = await this.movieRepo.findOneBy({id: review.movie});
        if (!movieFromDB) {
            throw createError(404, `Movie with title < ${review.movie} > does not exist`);
        }

        const authorFromDB = await this.userRepo.findOneBy({id: review.author});
        if (!authorFromDB) {
            throw createError(404, `User with username < ${review.author} > does not exist`);
        }

        const reviewToSave: ReviewEntity = new ReviewEntity();
        reviewToSave.title = review.title;
        reviewToSave.review = review.review;
        reviewToSave.author = authorFromDB;
        reviewToSave.movie = movieFromDB;


        // Save review using the repository
        await this.repository.save(reviewToSave);

        // Return a success message or the new review ID
        return "Review Published";
    }

    async get(reviewId: number): Promise<ReviewDtoIn> {
        const reviewFromDB = await this.repository.findOneBy({id: reviewId});

        if (!reviewFromDB) {
            throw createError(404, "The review doesn't exist");
        }

        const review : ReviewDtoIn = {
            title: reviewFromDB.title,
            review: reviewFromDB.review,
            author: reviewFromDB.author.id,
            movie: reviewFromDB.movie.id,
        };

        return review;
    }

    async getAll(): Promise<ReviewDtoIn[]> {
        const reviewsFromDB = await this.repository.find();
        if (!reviewsFromDB) {
            throw createError(404, `No reviews found`);
        }

        const allReviews = reviewsFromDB.map((review: ReviewEntity) => ({
            title: review.title,
            review: review.review,
            author: review.author.id,
            movie: review.movie.id
        }));

        return allReviews;
    }
}
