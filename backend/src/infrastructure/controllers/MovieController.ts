import {NextFunction, Request, Response} from "express";
import {MovieService} from "../../application/services/MovieService";
import {autoInjectable, container} from "tsyringe";
import {MovieRepository} from "../repositories/MovieRepository";
import {Movie} from "../../domain/models/Movie";
import createError from "http-errors";

container.register(
    "IMovieRepository", {
        useClass: MovieRepository
    });

@autoInjectable()
export class MovieController {
    private static movieService: MovieService = container.resolve(MovieService);

    static async getMovie(req: Request, res: Response, next: NextFunction) {
        try {
            const title = req.params.title;
            const result = await this.movieService.getMovie(title);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
    static async getAllMovies(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.movieService.getAllMovies();
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async getTop10(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.movieService.getTop10();
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async search(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query.query as string;
            if (!query) {
                return res.status(400).json({ message: "Query parameter is required" });
            }

            const movies = await this.movieService.searchMovies(query);
            return res.status(200).json(movies);
        } catch (e) {
            next(e);
        }
    }
}