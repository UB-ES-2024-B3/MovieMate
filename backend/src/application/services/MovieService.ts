import {Movie} from "../../domain/models/Movie";
import {inject, injectable} from "tsyringe";
import {IMovieRepository} from "../../domain/repositories/IMovieRepository";
import {MoviesList} from "../../interfaces/Interfaces";

@injectable()
export class MovieService {
    constructor(@inject("IMovieRepository") private movieRepository: IMovieRepository) {
    }

    async getMovie(title: string): Promise<Movie> {
        return await this.movieRepository.get(title);
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
}