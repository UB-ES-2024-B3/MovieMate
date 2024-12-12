import {NextFunction, Request, Response} from "express";
import {CommentService} from "../../application/services/CommentService";
import {autoInjectable, container} from "tsyringe";
import {CommentRepository} from "../repositories/CommentRepository";
import {DtoInValidation} from "../../interfaces/DtoInValidation";
import {isRight} from 'fp-ts/lib/Either';
import createError from "http-errors";
import {CommentDtoIn, UpdateCommentData} from "../../interfaces/Interfaces";

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

    static async getComment(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.commentService.getComment(id);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async getAllComments(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.commentService.getAllComments();
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async getCommentsByPost(req: Request, res: Response, next: NextFunction) {
        try {
            const postId = parseInt(req.params.postId);
            const result = await this.commentService.getCommentsByPost(postId);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async getCommentsByReview(req: Request, res: Response, next: NextFunction) {
        try {
            const reviewId = parseInt(req.params.reviewId);
            const result = await this.commentService.getCommentsByReview(reviewId);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async getCommentsByComment(req: Request, res: Response, next: NextFunction) {
        try {
            const commentId = parseInt(req.params.commentId);
            const result = await this.commentService.getCommentsByComment(commentId);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async updateComment(req: Request, res: Response, next: NextFunction) {
        try {
            const commentId = parseInt(req.params.commentId);
            const commentData = req.body;

            const validationResult = DtoInValidation.validateUpdateCommentDto(commentData);

            if (!isRight(validationResult)) {
                // Si la validación falla, devolver un error
                throw createError(400, "Invalid comment data!");
            }

            const validatedData = validationResult.right;

            const validatedComment: UpdateCommentData = {
                content: validatedData.content
            }

            const result = await this.commentService.updateComment(commentId, validatedComment);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const commentId = parseInt(req.params.commentId);
            const result = await this.commentService.deleteComment(commentId);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async addLike(req: Request, res:Response, next: NextFunction){
        try {
            const userName = req.body.userName;
            const commentID = parseInt(req.body.commentId);

            if(!userName || isNaN(commentID)){
                throw createError(400, `Parameters are incorrect`);
            }

            const result = await this.commentService.addLike(userName, commentID);
            return res.status(200).json(result);
        }catch (error){
            next(error);
        }
    }

    static async addDislike(req: Request, res:Response, next: NextFunction){
        try {
            const userName = req.body.userName;
            const commentID = parseInt(req.body.commentId);

            if(!userName || isNaN(commentID)){
                throw createError(400, `Parameters are incorrect`);
            }

            const result = await this.commentService.addDislike(userName, commentID);
            return res.status(200).json(result);
        }catch (error){
            next(error);
        }
    }
}