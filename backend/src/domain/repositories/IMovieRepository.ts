import {Movie} from "../models/Movie"
import {MovieReviewDtoOut, MoviesList} from "../../interfaces/Interfaces";

export interface IMovieRepository {
    get(title: string): Promise<Movie>;

    getbyId(id: number): Promise<Movie>;

    getAll(): Promise<Movie[]>;

    getTop10(): Promise<Movie[]>;

    search(query: string): Promise<MoviesList[]>;

    reviewMovie(userName: string, idMovie: number, puntuacion: number): Promise<MovieReviewDtoOut>;

    addFavorites(userName: string, idMovie: number): Promise<string>;
}