import {inject, injectable} from "tsyringe";
import {ICommentRepository} from "../../domain/repositories/ICommentRepository";
import {CommentDtoIn} from "../../interfaces/Interfaces";

@injectable()
export class CommentService {
    constructor(@inject("ICommentRepository") private commentRepository: ICommentRepository) {
    }

    async createComment(comment: CommentDtoIn): Promise<string> {
        return await this.commentRepository.create(comment);
    }

}