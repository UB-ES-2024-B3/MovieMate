import {Movie} from "../models/Movie"

export interface IMovieRepository {
    get(title: string): Promise<Movie>;
}