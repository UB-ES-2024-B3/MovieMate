import {NextFunction, Request, Response} from "express";
import {ReviewService} from "../../application/services/ReviewService";
import {autoInjectable, container} from "tsyringe";
import {ReviewRepository} from "../repositories/ReviewRepository";
import {DtoInValidation} from "../../interfaces/DtoInValidation";
import {isRight} from 'fp-ts/lib/Either';
import createError from "http-errors";
import {ReviewDtoIn} from "../../interfaces/Interfaces";

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

container.register(
    "IReviewRepository", {
        useClass: ReviewRepository
    });

@autoInjectable()
export class ReviewController {

    private static reviewService: ReviewService = container.resolve(ReviewService);

    static async createReview(req: Request, res: Response, next: NextFunction) {
        try {
            const reviewData = req.body;

            // Validar los datos con la clase DtoIn
            const validationResult = DtoInValidation.validateReviewDto(reviewData);

            if (!isRight(validationResult)) {
                // Si la validación falla, devolver un error
                throw createError(400, "Invalid review data!");
            }

            // Si la validación es correcta, accedemos a los datos validados
            const validatedData = validationResult.right;

            // Creación del objeto Review con los datos validados
            const review: ReviewDtoIn = {
                author: validatedData.author,
                movie: validatedData.movie,
                review: validatedData.review,
                title: validatedData.title
            }

            const result = await this.reviewService.createReview(review);
            return res.status(200).json(result);

        } catch (e) {
            next(e);
        }

    }

    static async getReview(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.reviewService.getReview(id);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async getAllReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.reviewService.getAllReviews();
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async addLike(req: Request, res:Response, next: NextFunction) {
        try {
            const userName = req.body.userName;
            const idReview = parseInt(req.body.idReview);


            if(!userName || isNaN(idReview)){
                throw createError(400, `Parameters are incorrect`);
            }

            const result = await this.reviewService.addLike(userName, idReview);
            return res.status(200).json(result);
        }catch (error){
            next(error);
        }
    }

    static async addDislike(req: Request, res: Response, next: NextFunction){
        try {
            const userName = req.body.userName;
            const idReview = parseInt(req.body.idReview);

            if(!userName || isNaN(idReview)){
                throw createError(400, `Parameters are incorrect`);
            }

            const result = await this.reviewService.addDislike(userName, idReview);
            return res.status(200).json(result);
        }catch (error){
            next(error);
        }
    }
}
