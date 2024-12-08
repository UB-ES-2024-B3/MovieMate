import {NextFunction, Request, Response} from "express";
import {CommentService} from "../../application/services/CommentService";
import {autoInjectable, container} from "tsyringe";
import {CommentRepository} from "../repositories/CommentRepository";
import {DtoInValidation} from "../../interfaces/DtoInValidation";
import {isRight} from 'fp-ts/lib/Either';
import createError from "http-errors";
import {CommentDtoIn} from "../../interfaces/Interfaces";

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

container.register(
    "ICommentRepository", {
        useClass: CommentRepository
    });

@autoInjectable()
export class CommentController {
    private static commentService: CommentService = container.resolve(CommentService);

    static async createComment(req: Request, res: Response, next: NextFunction) {
        try {
            const commentData = req.body;

            const validationResult = DtoInValidation.validateCommentDto(commentData);

            if (!isRight(validationResult)) {
                // Si la validación falla, devolver un error
                throw createError(400, "Invalid comment data!");
            }

            const validatedData = validationResult.right;

            const validatedComment: CommentDtoIn = {
                content: validatedData.content,
                author: validatedData.author,
                post: validatedData.post,
                review: validatedData.review,
                comment: validatedData.comment
            }

            const result = await this.commentService.createComment(validatedComment);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}