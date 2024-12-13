import {Movie} from "../models/Movie"
import {Filters, MovieReviewDtoOut, MoviesList, MovieWithReviewsDtoOut} from "../../interfaces/Interfaces";

export interface IMovieRepository {
    get(title: string): Promise<MovieWithReviewsDtoOut>;

    getbyId(id: number): Promise<Movie>;

    getAll(): Promise<Movie[]>;

    getTop10(): Promise<Movie[]>;

    search(query: string): Promise<MoviesList[]>;

    reviewMovie(userName: string, idMovie: number, puntuacion: number): Promise<MovieReviewDtoOut>;

    addFavorites(userName: string, idMovie: number): Promise<string>;

    getMoviesFiltered(n: number, maxPageSize: number, filters: Filters);
}