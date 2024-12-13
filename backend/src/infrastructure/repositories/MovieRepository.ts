import {Between, FindOptionsWhere, ILike, MoreThanOrEqual, Raw, Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IMovieRepository} from "../../domain/repositories/IMovieRepository";
import {MovieEntity} from "../entities/MovieEntity";
import {Movie} from "../../domain/models/Movie";
import createError from 'http-errors';
import {
    AuthorDtoOut,
    Filters,
    GetMoviesFilteredDtoOut,
    MovieReviewDtoOut,
    MoviesList,
    MovieWithReviewsDtoOut,
    ReviewDtoOut
} from "../../interfaces/Interfaces";
import {UserEntity} from "../entities/UserEntity";
import {ReviewEntity} from "../entities/ReviewEntity";

export class MovieRepository implements IMovieRepository {
    private readonly repository: Repository<MovieEntity>;
    private readonly userRepo: Repository<UserEntity>;
    private readonly reviewRepo: Repository<ReviewEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(MovieEntity);
        this.userRepo = PostgreTypeOrmDataSource.getRepository(UserEntity);
        this.reviewRepo = PostgreTypeOrmDataSource.getRepository(ReviewEntity);
    }

    async get(title: string): Promise<MovieWithReviewsDtoOut> {
        const movieFromDB = await this.repository.findOne({where: {title: title}});

        if (!movieFromDB) {
            throw createError(404, `Movie with title < ${title} > does not exist`);
        }

        const reviewsFromDB = await this.reviewRepo.find({
            where: {movie: {id: movieFromDB.id}},
            order: {createdAt: 'DESC'},
            relations: ['author'],
        });

        const reviews: ReviewDtoOut[] = reviewsFromDB.map((reviewFromDB: ReviewEntity) => {
            const author: AuthorDtoOut = {
                id: reviewFromDB.author.id,
                userName: reviewFromDB.author.userName,
                image: reviewFromDB.author.image ? this.imageToBase64(reviewFromDB.author.image) : null
            };
            return {
                id: reviewFromDB.id,
                title: reviewFromDB.title,
                content: reviewFromDB.review,
                author: author,
                like: reviewFromDB.like,
                disLike: reviewFromDB.disLike,
                totalComments: reviewFromDB.totalComments
            };
        });

        const movie = new Movie(
            movieFromDB.id,
            movieFromDB.title,
            movieFromDB.description,
            movieFromDB.genres,
            movieFromDB.directors,
            movieFromDB.actors,
            movieFromDB.premiereDate,
            movieFromDB.duration,
            movieFromDB.classification,
            movieFromDB.score,
            movieFromDB.totalReviews ? movieFromDB.totalReviews.length : 0,
            this.imageToBase64(movieFromDB.image)
        );

        const result: MovieWithReviewsDtoOut = {
            movie: movie,
            reviews: reviews
        };

        return result;
    }

    async getbyId(id: number): Promise<Movie> {
        const movieFromDB = await this.repository.findOneBy({id: id});
        if (!movieFromDB) {
            throw createError(404, `Movie with id < ${id} > does not exist`);
        }

        const movie = new Movie(
            movieFromDB.id,
            movieFromDB.title,
            movieFromDB.description,
            movieFromDB.genres,
            movieFromDB.directors,
            movieFromDB.actors,
            movieFromDB.premiereDate,
            movieFromDB.duration,
            movieFromDB.classification,
            movieFromDB.score,
            movieFromDB.totalReviews ? movieFromDB.totalReviews.length : 0,
            this.imageToBase64(movieFromDB.image)
        );

        return movie;
    }

    async getAll(): Promise<Movie[]> {
        const moviesFromDB = await this.repository.find();
        if (!moviesFromDB) {
            throw createError(404, `No movies found`);
        }
        const allMovies = moviesFromDB.map((moviesFromDB: MovieEntity) => {
            return new Movie(
                moviesFromDB.id,
                moviesFromDB.title,
                moviesFromDB.description,
                moviesFromDB.genres,
                moviesFromDB.directors,
                moviesFromDB.actors,
                moviesFromDB.premiereDate,
                moviesFromDB.duration,
                moviesFromDB.classification,
                moviesFromDB.score,
                moviesFromDB.totalReviews ? moviesFromDB.totalReviews.length : 0,
                this.imageToBase64(moviesFromDB.image)
            );
        });
        return allMovies;
    }

    async getTop10(): Promise<Movie[]> {
        const top10FromDB = await this.repository.find({
            order: {score: 'DESC'},
            take: 10
        });

        if (!top10FromDB || top10FromDB.length === 0) {
            throw createError('404, No top 10 movies found');
        }

        const top10movies = top10FromDB.map((top10FromDB: MovieEntity) => {
            return new Movie(
                top10FromDB.id,
                top10FromDB.title,
                top10FromDB.description,
                top10FromDB.genres,
                top10FromDB.directors,
                top10FromDB.actors,
                top10FromDB.premiereDate,
                top10FromDB.duration,
                top10FromDB.classification,
                top10FromDB.score,
                top10FromDB.totalReviews ? top10FromDB.totalReviews.length : 0,
                this.imageToBase64(top10FromDB.image)
            );
        });

        return top10movies;
    }

    imageToBase64(image: Buffer | null): string | null {
        return image ? `data:image/jpeg;base64,${image.toString('base64')}` : null;
    }

    async search(query: string): Promise<MoviesList[]> {
        const movies = await this.repository.find({
            where: [{title: ILike(`%${query}%`)}], order: {title: 'ASC'},
        });

        if (movies.length === 0) {
            throw createError(404, "Movies not found");
        }

        return movies.map(movie => ({
            title: movie.title,
            premiereDate: movie.premiereDate,
            genres: movie.genres,
            directors: movie.directors,
            image: this.imageToBase64(movie.image) || "No image available",
        }));
    }

    async reviewMovie(userName: string, idMovie: number, puntuacion: number): Promise<MovieReviewDtoOut> {
        const user = await this.userRepo.findOne({
            where: {userName: userName},
            relations: ["reviewed"],
        });

        if (!user) {
            throw createError(404, `User does not exist`);
        }

        const movie = await this.repository.findOneBy({id: idMovie});
        if (!movie) {
            throw createError(404, `Movie does not exist`);
        }

        const hasReviewed = user.reviewed.some(reviewedMovie => reviewedMovie.id === idMovie);

        if (!hasReviewed) {
            user.reviewed.push(movie);

            if (!movie.totalReviews) {
                movie.totalReviews = [];
            }
            movie.totalReviews.push(puntuacion);
        } else {
            const reviewIndex = user.reviewed.findIndex(reviewedMovie => reviewedMovie.id === idMovie);
            if (reviewIndex !== -1) {
                movie.totalReviews[reviewIndex] = puntuacion;
            }
        }

        const totalScores = movie.totalReviews.reduce((sum, score) => sum + score, 0);
        movie.score = totalScores / movie.totalReviews.length;

        const movieReview: MovieReviewDtoOut = {
            totalReview: movie.totalReviews.length,
            score: movie.score
        };

        await this.userRepo.save(user);
        await this.repository.save(movie);

        return movieReview
    }

    async addFavorites(userName: string, idMovie: number): Promise<string> {
        const user = await this.userRepo.findOne({
            where: {userName: userName},
            relations: ["favs"],
        });

        if (!user) {
            throw createError(404, `User does not exist`);
        }

        const movie = await this.repository.findOneBy({id: idMovie});
        if (!movie) {
            throw createError(404, `Movie does not exist`);
        }

        const isFav = user.favs.some(favMovie => favMovie.id === idMovie);
        if (!isFav) {
            user.favs.push(movie);

            await this.userRepo.save(user);
        } else {
            user.favs = user.favs.filter(favMovie => favMovie.id !== idMovie);

            await this.userRepo.save(user);
        }

        return !isFav ? "Movie added to favorites" : "Movie removed from favorites";

    }

    async getMoviesFiltered(n: number, maxPageSize: number, filters: Filters) {
        try {
            let where: FindOptionsWhere<MovieEntity> | Array<FindOptionsWhere<MovieEntity>> = {};

            // Filtrar por géneros
            if (filters.genres) {
                where.genres = Raw((alias) => `${alias} @> :genres`, {genres: JSON.stringify([filters.genres])});
            }

            // Filtrar por directores
            if (filters.directors) {
                where.directors = Raw((alias) => `${alias} @> :directors`, {directors: JSON.stringify([filters.directors])});
            }

            // Filtrar por actores
            if (filters.actors) {
                where.actors = Raw((alias) => `${alias} @> :actors`, {actors: JSON.stringify([filters.actors])});
            }

            // Filtrar por año de estreno
            if (filters.premiereYear) {
                const startOfYear = new Date(filters.premiereYear, 0, 1);
                const endOfYear = new Date(filters.premiereYear, 11, 31, 23, 59, 59);
                where.premiereDate = Between(startOfYear, endOfYear);
            }

            // Filtrar por duración
            if (filters.duration) {
                where.duration = MoreThanOrEqual(filters.duration);
            }

            // Filtrar por clasificación
            if (filters.classification) {
                where.classification = ILike(`%${filters.classification}%`);
            }

            // Filtrar por puntuación mínima
            if (filters.score) {
                where.score = MoreThanOrEqual(filters.score);
            }

            // Filtrar por rango de total de reseñas
            if (filters.totalReviews) {
                where.totalReviews = MoreThanOrEqual(filters.totalReviews);
            }

            const skip = (n - 1) * maxPageSize;

            // Consulta principal
            const moviesFromDb = await MovieEntity.find({
                where,
                skip,
                take: maxPageSize,
            });

            // Conteo total de resultados para paginación
            const total = await MovieEntity.count({where});

            // Construcción de la respuesta
            const totalPages = Math.ceil(total / maxPageSize);

            if (total == 0) {
                n = 0
            }

            const dtoOut: GetMoviesFilteredDtoOut = {
                movies: moviesFromDb.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    image: movie.image ? movie.image.toString('base64') : null,
                })),
                paginationInfo: {
                    moviesFound: total,
                    actualPage: n,
                    totalPages: totalPages,
                },
            };

            return dtoOut;

        } catch (e) {
            throw createError(404, `Any movie matches this filters`);
        }
    }

}
