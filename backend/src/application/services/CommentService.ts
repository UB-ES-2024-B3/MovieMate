import {inject, injectable} from "tsyringe";
import {ICommentRepository} from "../../domain/repositories/ICommentRepository";
import {CommentDtoIn, CommentDtoOut, UpdateCommentData} from "../../interfaces/Interfaces";

@injectable()
export class CommentService {
    constructor(@inject("ICommentRepository") private commentRepository: ICommentRepository) {
    }

    async createComment(comment: CommentDtoIn): Promise<string> {
        return await this.commentRepository.create(comment);
    }

    async getComment(id: number): Promise<CommentDtoOut> {
        return await this.commentRepository.get(id);
    }

    async getAllComments(): Promise<CommentDtoOut[]> {
        return await this.commentRepository.getAll();
    }

    async getCommentsByPost(postId: number): Promise<CommentDtoOut[]> {
        return await this.commentRepository.getByPost(postId);
    }

    async getCommentsByReview(reviewId: number): Promise<CommentDtoOut[]> {
        return await this.commentRepository.getByReview(reviewId);
    }

    async getCommentsByComment(commentId: number): Promise<CommentDtoOut[]> {
        return await this.commentRepository.getByComment(commentId);
    }

    async updateComment(commentId: number, comment: UpdateCommentData): Promise<string> {
        return await this.commentRepository.update(commentId, comment);
    }

    async deleteComment(commentId: number): Promise<string> {
        return await this.commentRepository.delete(commentId);
    }

}