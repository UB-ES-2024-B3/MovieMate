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
}