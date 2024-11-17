import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IMovieRepository} from "../../domain/repositories/IMovieRepository";
import {MovieEntity} from "../entities/MovieEntity";
import {Movie} from "../../domain/models/Movie";
import createError from 'http-errors';

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
            movieFromDB.score
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
                moviesFromDB.score
            );
        })
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

        const top10movies = top10FromDB.map((movieEntity: MovieEntity) => {
            return new Movie(
                movieEntity.id,
                movieEntity.title,
                movieEntity.description,
                movieEntity.genres,
                movieEntity.directors,
                movieEntity.actors,
                movieEntity.premiereDate,
                movieEntity.duration,
                movieEntity.classification,
                movieEntity.score
            );
        });

        return top10movies;
    }
}