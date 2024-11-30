import {Movie} from "../models/Movie"
import {MovieReviewDtoOut, MoviesList, MovieWithReviewsDtoOut} from "../../interfaces/Interfaces";

export interface IMovieRepository {
    get(title: string): Promise<MovieWithReviewsDtoOut>;

    getAll(): Promise<Movie[]>;

    getTop10(): Promise<Movie[]>;

    search(query: string): Promise<MoviesList[]>;

    reviewMovie(idUsuario: number, idMovie: number, puntuacion: number): Promise<MovieReviewDtoOut>;
}