import {CommentDtoIn} from "../../interfaces/Interfaces";

export interface ICommentRepository {
    create(comment: CommentDtoIn): Promise<string>;
}