import {NextFunction, Request, Response} from "express";
import {MovieService} from "../../application/services/MovieService";
import {autoInjectable, container} from "tsyringe";
import {MovieRepository} from "../repositories/MovieRepository";
import createError from "http-errors";
import {DtoInValidation} from "../../interfaces/DtoInValidation";
import {isRight} from "fp-ts/Either";
import {User} from "../../domain/models/User";
import {Movie} from "../../domain/models/Movie";
import * as t from "io-ts";
import movieRoutes from "../routes/MovieRoutes";

container.register(
    "IMovieRepository", {
        useClass: MovieRepository
    });

@autoInjectable()
export class MovieController {
    private static movieService: MovieService = container.resolve(MovieService);

    static async getMovie(req: Request, res: Response, next: NextFunction) {
        try {
            let result;
            if (!isNaN(Number(req.params.title))) {
                const title = parseInt(req.params.title);
                result = await this.movieService.getMoviebyId(title);
            } else {
                const title = req.params.title;
                result = await this.movieService.getMovie(title);
            }

            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async createMovie(req: Request, res: Response, next: NextFunction){
        try{
            const movieData = req.body;

            // Validar los datos con la clase DtoIn
            const validationResult = DtoInValidation.validateMovieDto(movieData);

            if (!isRight(validationResult)) {
                // Si la validación falla, devolver un error
                throw createError(400, "Invalid movie data!");
            }

            // Si la validación es correcta, accedemos a los datos validados
            const validatedData = validationResult.right;

            const movie: Movie = new Movie(
                null,
                validatedData.title,
                validatedData.description,
                validatedData.genres,
                validatedData.directors,
                validatedData.actors,
                new Date(validatedData.premiereDate),
                validatedData.duration,
                validatedData.classification,
                validatedData.score,
                validatedData.totalReviews
            );

            const result = await this.movieService.createMovie(movie);
            return res.status(200).json(result);
        }catch (e){
            next(e);
        }
    }

    static async deleteMovie(req: Request, res: Response, next: NextFunction){
        try{
            const movieId = parseInt(req.params.movieId);
            const result = await this.movieService.deleteMovie(movieId);
            return res.status(200).json(result)
        }catch (e){
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
                return res.status(400).json({message: "Query parameter is required"});
            }

            const movies = await this.movieService.searchMovies(query);
            return res.status(200).json(movies);
        } catch (e) {
            next(e);
        }
    }

    static async scoreMovie(req: Request, res: Response, next: NextFunction) {
        try {
            const userName = req.body.userName;
            const idMovie = parseInt(req.body.idMovie);
            const puntuacion = parseFloat(req.body.puntuacion);

            if (!userName || isNaN(idMovie) || isNaN(puntuacion)) {
                throw createError(400, `Parameters are incorrect`);
            }

            if (puntuacion > 5 || puntuacion < 0) {
                throw createError(400, `Incorrect Puntuation`);
            }

            const result = await this.movieService.reviewMovie(userName, idMovie, puntuacion);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async addFavorites(req: Request, res: Response, next: NextFunction) {
        try {
            const userName = req.body.userName;
            const idMovie = parseInt(req.body.idMovie);

            if (!userName || isNaN(idMovie)) {
                throw createError(400, `Parameters are incorrect`);
            }

            const result = await this.movieService.addFavorites(userName, idMovie);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getMoviesFiltered(req: Request, res: Response, next: NextFunction) {
        const maxPageSize = Number(req.query.maxPageSize)
        const pageNumber = Number(req.query.pageNumber)
        const filters = req.body
        try {
            const movies = await this.movieService.getMoviesFiltered(pageNumber, maxPageSize, filters)
            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }
}