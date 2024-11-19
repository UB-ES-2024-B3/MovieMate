import {ILike, Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IMovieRepository} from "../../domain/repositories/IMovieRepository";
import {MovieEntity} from "../entities/MovieEntity";
import {Movie} from "../../domain/models/Movie";
import createError from 'http-errors';
import {MoviesList} from "../../interfaces/Interfaces";

export class MovieRepository implements IMovieRepository {
    private readonly repository: Repository<MovieEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(MovieEntity);
    }

    async get(title: string): Promise<Movie> {
        const movieFromDB = await this.repository.findOneBy({title: title});
        if (!movieFromDB) {
            throw createError(404, `Movie with title < ${title} > does not exist`);
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
            where: [{ title: ILike(`%${query}%`) }], order: {title: 'ASC'},
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
}