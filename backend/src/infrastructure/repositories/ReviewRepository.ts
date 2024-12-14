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
        reviewToSave.like = review.like;
        reviewToSave.disLike = review.disLike;


        // Save review using the repository
        await this.repository.save(reviewToSave);

        // Return a success message or the new review ID
        return "Review Published";
    }

    async deleteReview(reviewId:number): Promise<string> {
        const reviewFromDB = await this.repository.findOne({where: {id: reviewId},
            relations: ['author', 'movie'],});

        if (!reviewFromDB) {
            throw createError(404, `Review with id < ${reviewId} > does not exist`);
        }

        await this.repository.remove(reviewFromDB);

        return "Review Deleted";
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
            like: reviewFromDB.like,
            disLike: reviewFromDB.disLike,
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
                like: review.like,
                disLike: review.disLike,
                totalComments: review.totalComments
            };

            return reviewDto;
        });

        return allReviews;

    }

    async addLike(userName: string, idReview: number): Promise<string>{
        const user = await  this.userRepo.findOne({where: {userName: userName}});
        if(!user){
            throw createError(404, `User does not exist`);
        }

        const review = await this.repository.findOne({where: {id: idReview}, relations:["likedBy", "dislikeBy"]});
        if(!review){
            throw createError(404, `Review does not exist`);
        }

        const hasLiked = review.likedBy.some(likedUser => likedUser.userName === userName);
        const hasDisliked = review.dislikeBy.some(dislikedUser => dislikedUser.userName === userName);

        if(!hasLiked){
            review.likedBy.push(user);

            if(hasDisliked){
                review.dislikeBy = review.dislikeBy.filter(dislikedUser => dislikedUser.userName !== userName);
                review.disLike -= 1;
            }

            review.like += 1;

            await this.repository.save(review);

            return "Review liked";
        }else {
            review.likedBy = review.likedBy.filter(likedUser => likedUser.userName !== userName);

            review.like = Math.max(0, review.like -1);

            await this.repository.save(review);

            return "Like removed from review";
        }
    }

    async addDislike(userName: string, idReview: number): Promise<string> {
        const user = await this.userRepo.findOne({where: {userName: userName}});
        if (!user) {
            throw createError(404, `User does not exist`);
        }

        const review = await this.repository.findOne({where: {id: idReview}, relations: ["likedBy", "dislikeBy"]});
        if (!review) {
            throw createError(404, `Review does not exist`);
        }

        const hasLike = review.likedBy.some(likedUser => likedUser.userName === userName);
        const hasDislike = review.dislikeBy.some(dislikeUser => dislikeUser.userName === userName);

        if (!hasDislike) {
            review.dislikeBy.push(user);

            if (hasLike) {
                review.likedBy = review.likedBy.filter(likedUser => likedUser.userName !== userName) || null;
                review.like -= 1;
            }

            review.disLike += 1;

            await this.repository.save(review);

            return "Review disliked";
        } else {
            review.dislikeBy = review.dislikeBy.filter(dislikeUser => dislikeUser.userName !== userName) || null;

            review.disLike = Math.max(0, review.disLike -1);

            await this.repository.save(review);

            return "Dislike removed from review";
        }
    }


}
