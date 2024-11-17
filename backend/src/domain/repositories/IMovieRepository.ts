import {Movie} from "../models/Movie"

export interface IMovieRepository {
    get(title: string): Promise<Movie>;

    getAll(): Promise<Movie[]>;

    getTop10(): Promise<Movie[]>;
}