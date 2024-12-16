import {Movie} from "../../domain/models/Movie";
import {inject, injectable} from "tsyringe";
import {IMovieRepository} from "../../domain/repositories/IMovieRepository";
import {Filters, MovieDtoOut, MovieReviewDtoOut, MoviesList, MovieWithReviewsDtoOut} from "../../interfaces/Interfaces";

@injectable()
export class MovieService {
    constructor(@inject("IMovieRepository") private movieRepository: IMovieRepository) {
    }

    async createMovie(movie: Movie): Promise<string> {
        return await this.movieRepository.createMovie(movie);
    }

    async deleteMovie(id: number) {
        return await this.movieRepository.deleteMovie(id);
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

    async getAllPremiereYears(): Promise<number[]> {
        return await this.movieRepository.getUniquePremiereYears();
    }

    async getDurationRange(): Promise<{ min: number; max: number }> {
        return await this.movieRepository.getDurationRange();
    }

    async getScoreRange(): Promise<{ min: number; max: number }> {
        return await this.movieRepository.getScoreRange();
    }

    async getTotalReviewsRange(): Promise<{ min: number; max: number }> {
        return await this.movieRepository.getTotalReviewsRange();
    }

    async getAllActors(): Promise<string[]> {
        return await this.movieRepository.getUniqueActors();
    }

    async getAllDirectors(): Promise<string[]> {
        return await this.movieRepository.getUniqueDirectors();
    }

    async getAllGenres(): Promise<string[]> {
        return await this.movieRepository.getUniqueGenres();
    }

    async getAllClassifications(): Promise<string[]> {
        return await this.movieRepository.getUniqueClassifications();
    }

    async getTop10Reviewed(): Promise<MovieDtoOut[]> {
        return await this.movieRepository.getTop10Reviewed();
    }

}

