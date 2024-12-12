import {CommentDtoIn, CommentDtoOut, UpdateCommentData} from "../../interfaces/Interfaces";

export interface ICommentRepository {
    create(comment: CommentDtoIn): Promise<string>;
    get(id: number): Promise<CommentDtoOut>;
    getAll(): Promise<CommentDtoOut[]>;
    getByPost(postId: number): Promise<CommentDtoOut[]>;
    getByReview(reviewId: number): Promise<CommentDtoOut[]>;
    getByComment(commentId: number): Promise<CommentDtoOut[]>;
    update(commentId: number, comment: UpdateCommentData): Promise<string>;
    delete(commentId: number): Promise<string>;
    addLike(userName: string, commentId: number): Promise<string>;
    addDislike(userName: string, commentId: number): Promise<string>
}