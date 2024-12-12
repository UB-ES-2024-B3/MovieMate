import {Movie} from "../../domain/models/Movie";
import {inject, injectable} from "tsyringe";
import {IMovieRepository} from "../../domain/repositories/IMovieRepository";
import {Filters, MovieReviewDtoOut, MoviesList, MovieWithReviewsDtoOut} from "../../interfaces/Interfaces";

@injectable()
export class MovieService {
    constructor(@inject("IMovieRepository") private movieRepository: IMovieRepository) {
    }

    async getMovie(title: string): Promise<MovieWithReviewsDtoOut> {
        return await this.movieRepository.get(title);
    }

    async getMoviebyId(id: number): Promise<Movie> {
        return await this.movieRepository.getbyId(id);
    }

    async getAllMovies() {
        return await this.movieRepository.getAll();
    }

    async getTop10() {
        return await this.movieRepository.getTop10();
    }

    async searchMovies(query: string): Promise<MoviesList[]> {
        return await this.movieRepository.search(query);
    }

    async reviewMovie(userName: string, idMovie: number, puntuacion: number): Promise<MovieReviewDtoOut> {
        return await this.movieRepository.reviewMovie(userName, idMovie, puntuacion);
    }

    async addFavorites(userName: string, idMovie: number): Promise<String> {
        return await this.movieRepository.addFavorites(userName, idMovie);
    }

    async getMoviesFiltered(n: number, maxPageSize: number, filters: Filters) {
        return await this.movieRepository.getMoviesFiltered(n, maxPageSize, filters)
    }
}

