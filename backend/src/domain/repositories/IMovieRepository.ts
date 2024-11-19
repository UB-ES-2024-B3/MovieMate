import {Movie} from "../models/Movie"
import {MoviesList} from "../../interfaces/Interfaces";

export interface IMovieRepository {
    get(title: string): Promise<Movie>;

    getAll(): Promise<Movie[]>;

    getTop10(): Promise<Movie[]>;

    search(query: string): Promise<MoviesList[]>;
}