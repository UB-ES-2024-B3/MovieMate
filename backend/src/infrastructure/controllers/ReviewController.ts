import {NextFunction, Request, Response} from "express";
import {ReviewService} from "../../application/services/ReviewService";
import {autoInjectable, container} from "tsyringe";
import {ReviewRepository} from "../repositories/ReviewRepository";
import {Review} from "../../domain/models/Review";
import {DtoInValidation} from "../../interfaces/DtoInValidation";
import {isRight} from 'fp-ts/lib/Either';
import createError from "http-errors";
import {User} from "../../domain/models/User";

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

            // Creación del objeto User con los datos validados
            const review: Review = new Review(
                null,
                validatedData.title,
                validatedData.review
            );

            const result = await this.reviewService.createReview(review);
            return res.status(200).json(result);

        } catch (e) {
            next(e);
        }

    }
}
