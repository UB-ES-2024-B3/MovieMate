import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {ICommentRepository} from "../../domain/repositories/ICommentRepository";
import {CommentEntity} from "../entities/CommentEntity";
import {PostEntity} from "../entities/PostEntity";
import {UserEntity} from "../entities/UserEntity";
import {ReviewEntity} from "../entities/ReviewEntity";
import createError from "http-errors";
import {CommentDtoIn} from "../../interfaces/Interfaces";

export class CommentRepository implements ICommentRepository {
    private readonly repository: Repository<CommentEntity>;
    private readonly userRepository: Repository<UserEntity>;
    private readonly postRepository: Repository<PostEntity>;
    private readonly reviewRepository: Repository<ReviewEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(CommentEntity);
        this.userRepository = PostgreTypeOrmDataSource.getRepository(UserEntity);
        this.postRepository = PostgreTypeOrmDataSource.getRepository(PostEntity);
        this.reviewRepository = PostgreTypeOrmDataSource.getRepository(ReviewEntity);
    }

    async create(comment: CommentDtoIn): Promise<string> {
        const authorFromDB = await this.userRepository.findOneBy({userName: comment.author});
        if (!authorFromDB) {
            throw createError(404, `User with userName < ${comment.author} > does not exist`);
        }

        let postFromDB = null;
        if (comment.post != null) {
            postFromDB = await this.postRepository.findOneBy({id: comment.post});
        }

        let reviewFromDB= null;
        if (comment.review != null) {
            reviewFromDB = await this.reviewRepository.findOneBy({id: comment.review});
        }

        let commentFromDB = null;
        if (comment.comment != null) {
            commentFromDB = await this.repository.findOneBy({id: comment.comment});
        }

        const commentToSave: CommentEntity = new CommentEntity();
        commentToSave.content = comment.content;
        commentToSave.author = authorFromDB;
        commentToSave.post = postFromDB;
        commentToSave.review = reviewFromDB;
        commentToSave.comment = commentFromDB;

        await this.repository.save(commentToSave);

        return "Comment published";
    }
}