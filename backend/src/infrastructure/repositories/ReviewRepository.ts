import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IReviewRepository} from "../../domain/repositories/IReviewRepository";
import {ReviewEntity} from "../entities/ReviewEntity";
import {AuthorDtoOut, MovieDtoOut, ReviewDtoIn, ReviewDtoOut} from "../../interfaces/Interfaces";
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

    imageToBase64(image: Buffer | null): string | null {
        return image ? `data:image/jpeg;base64,${image.toString('base64')}` : null;
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

    async get(reviewId: number): Promise<ReviewDtoOut> {
        const reviewFromDB = await this.repository.findOne({where: {id: reviewId},
            relations: ['author', 'movie'],});

        if (!reviewFromDB) {
            throw createError(404, "The review doesn't exist");
        }

        const author: AuthorDtoOut = {
            id: reviewFromDB.author.id,
            userName: reviewFromDB.author.userName,
            image: reviewFromDB.author.image ? this.imageToBase64(reviewFromDB.author.image) : null
        };

        const movie: MovieDtoOut = {
            id: reviewFromDB.movie.id,
            title: reviewFromDB.movie.title,
            image: reviewFromDB.movie.image ? this.imageToBase64(reviewFromDB.movie.image) : null
        };

        const review : ReviewDtoOut = {
            id: reviewFromDB.id,
            title: reviewFromDB.title,
            content: reviewFromDB.review,
            author: author,
            movie: movie,
            totalComments: reviewFromDB.totalComments
        };

        return review;
    }

    async getAll(): Promise<ReviewDtoOut[]> {
        const reviewsFromDB = await this.repository.find({relations: ['author', 'movie'],});
        if (!reviewsFromDB) {
            throw createError(404, `No reviews found`);
        }

        const allReviews = reviewsFromDB.map((review: ReviewEntity) => {
            const author: AuthorDtoOut = {
                id: review.author.id,
                userName: review.author.userName,
                image: review.author.image ? this.imageToBase64(review.author.image) : null
            };

            const movie: MovieDtoOut = {
                id: review.movie.id,
                title: review.movie.title,
                image: review.movie.image ? this.imageToBase64(review.movie.image) : null
            };

            const reviewDto: ReviewDtoOut = {
                id: review.id,
                title: review.title,
                content: review.review,
                author: author,
                movie: movie,
                totalComments: review.totalComments
            };

            return reviewDto;
        });

        return allReviews;

    }
}
