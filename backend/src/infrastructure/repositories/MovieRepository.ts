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
            movieFromDB.classification
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
                moviesFromDB.classification
            );
        })
        return allMovies;
    }
}