import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {ICommentRepository} from "../../domain/repositories/ICommentRepository";
import {CommentEntity} from "../entities/CommentEntity";
import {PostEntity} from "../entities/PostEntity";
import {UserEntity} from "../entities/UserEntity";
import {ReviewEntity} from "../entities/ReviewEntity";
import createError from "http-errors";
import {AuthorDtoOut, CommentDtoIn, CommentDtoOut, UpdateCommentData} from "../../interfaces/Interfaces";

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

    imageToBase64(image: Buffer | null): string | null {
        return image ? `data:image/jpeg;base64,${image.toString('base64')}` : null;
    }

    async create(comment: CommentDtoIn): Promise<string> {
        const authorFromDB = await this.userRepository.findOneBy({userName: comment.author});
        if (!authorFromDB) {
            throw createError(404, `User with userName < ${comment.author} > does not exist`);
        }

        let postFromDB = null;
        if (comment.post != null) {
            postFromDB = await this.postRepository.findOneBy({id: comment.post});
            postFromDB.totalComments = postFromDB.totalComments + 1;
            await this.postRepository.save(postFromDB);
        }

        let reviewFromDB= null;
        if (comment.review != null) {
            reviewFromDB = await this.reviewRepository.findOneBy({id: comment.review});
            reviewFromDB.totalComments = reviewFromDB.totalComments + 1;
            await this.repository.save(reviewFromDB);
        }

        let commentFromDB = null;
        if (comment.comment != null) {
            commentFromDB = await this.repository.findOneBy({id: comment.comment});
            commentFromDB.totalComments = commentFromDB.totalComments + 1;
            await this.repository.save(commentFromDB);
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

    async get(id: number): Promise<CommentDtoOut> {
        const commentFromDB = await this.repository.findOne({where: {id: id},
        relations: ['author', 'post', 'review', 'comment'],});

        if (!commentFromDB) {
            throw createError(404, `Comment does not exist`)
        }

        const author: AuthorDtoOut = {
            id: commentFromDB.author.id,
            userName: commentFromDB.author.userName,
            image: commentFromDB.author.image ? this.imageToBase64(commentFromDB.author.image) : null
        };


        const comment: CommentDtoOut = {
            id: commentFromDB.id,
            createdAt: commentFromDB.createdAt,
            content: commentFromDB.content,
            author: author,
            post: commentFromDB.post? commentFromDB.post.id: null,
            review: commentFromDB.review? commentFromDB.review.id: null,
            comment: commentFromDB.comment? commentFromDB.comment.id: null,
            totalComments: commentFromDB.totalComments,
            like: commentFromDB.like,
            disLike: commentFromDB.disLike
        }

        return comment;
    }

    async getAll(): Promise<CommentDtoOut[]> {
        const commentsFromDB = await this.repository.find({relations: ['author', 'post', 'review', 'comment']});

        if (!commentsFromDB) {
            throw createError(404, "No comments found");
        }

        const allComments = commentsFromDB.map((comment: CommentEntity) => {
            const author: AuthorDtoOut = {
                id: comment.author.id,
                userName: comment.author.userName,
                image: comment.author.image ? this.imageToBase64(comment.author.image) : null
            };

            const comments: CommentDtoOut = {
                id: comment.id,
                createdAt: comment.createdAt,
                content: comment.content,
                author: author,
                post: comment.post? comment.post.id: null,
                review: comment.review? comment.review.id: null,
                comment: comment.comment? comment.comment.id: null,
                totalComments: comment.totalComments,
                like: comment.like,
                disLike: comment.disLike,
            };

            return comments;
        });
        return allComments;
    }

    async getByPost(postId: number): Promise<CommentDtoOut[]> {
        const commentsFromDB = await this.repository.find({where: {post: {id: postId}}, relations: ['author', 'post', 'review', 'comment']});

        if (!commentsFromDB) {
            throw createError(404, "No comments found");
        }

        const allComments = commentsFromDB.map((comment: CommentEntity) => {
            const author: AuthorDtoOut = {
                id: comment.author.id,
                userName: comment.author.userName,
                image: comment.author.image ? this.imageToBase64(comment.author.image) : null
            };

            const comments: CommentDtoOut = {
                id: comment.id,
                createdAt: comment.createdAt,
                content: comment.content,
                author: author,
                post: comment.post? comment.post.id: null,
                review: comment.review? comment.review.id: null,
                comment: comment.comment? comment.comment.id: null,
                totalComments: comment.totalComments,
                like: comment.like,
                disLike: comment.disLike,
            };

            return comments;
        });
        return allComments;
    }

    async getByReview(reviewId: number): Promise<CommentDtoOut[]> {
        const commentsFromDB = await this.repository.find({where: {review: {id: reviewId}}, relations: ['author', 'post', 'review', 'comment']});

        if (!commentsFromDB) {
            throw createError(404, "No comments found");
        }

        const allComments = commentsFromDB.map((comment: CommentEntity) => {
            const author: AuthorDtoOut = {
                id: comment.author.id,
                userName: comment.author.userName,
                image: comment.author.image ? this.imageToBase64(comment.author.image) : null
            };

            const comments: CommentDtoOut = {
                id: comment.id,
                createdAt: comment.createdAt,
                content: comment.content,
                author: author,
                post: comment.post? comment.post.id: null,
                review: comment.review? comment.review.id: null,
                comment: comment.comment? comment.comment.id: null,
                totalComments: comment.totalComments,
                like: comment.like,
                disLike: comment.disLike
            };

            return comments;
        });
        return allComments;
    }

    async getByComment(commentId: number): Promise<CommentDtoOut[]> {
        const commentsFromDB = await this.repository.find({where: {comment: {id: commentId}}, relations: ['author', 'post', 'review', 'comment']});

        if (!commentsFromDB) {
            throw createError(404, "No comments found");
        }

        const allComments = commentsFromDB.map((comment: CommentEntity) => {
            const author: AuthorDtoOut = {
                id: comment.author.id,
                userName: comment.author.userName,
                image: comment.author.image ? this.imageToBase64(comment.author.image) : null
            };

            const comments: CommentDtoOut = {
                id: comment.id,
                createdAt: comment.createdAt,
                content: comment.content,
                author: author,
                post: comment.post? comment.post.id: null,
                review: comment.review? comment.review.id: null,
                comment: comment.comment? comment.comment.id: null,
                totalComments: comment.totalComments,
                like: comment.like,
                disLike: comment.disLike,
            };

            return comments;
        });
        return allComments;
    }

    async update(commentId: number, comment: UpdateCommentData) {
        const commentFromDB = await this.repository.findOne({where: {id: commentId},
            relations: ['author', 'post', 'review', 'comment'],});

        if (!commentFromDB) {
            throw createError(404, "Comment does not exist");
        }

        commentFromDB.content = comment.content || commentFromDB.content;

        await this.repository.save(commentFromDB);

        return "Comment updated";
    }

    async delete(commentId: number): Promise<string> {
        const commentFromDB = await this.repository.findOne({where: {id: commentId},
            relations: ['author', 'post', 'review', 'comment'],});

        if (!commentFromDB) {
            throw createError(404, "Comment does not exist");
        }

        commentFromDB.content = "Comentario Eliminado";

        await this.repository.save(commentFromDB);

        return "Comment deleted"
    }

    async addLike(userName: string, commentId: number): Promise<string>{
        const user = await this.userRepository.findOne({ where: { userName } });
        if(!user){
            throw createError(404, `User does not exist`);
        }

        const comment = await this.repository.findOne({ where: { id: commentId }, relations: ["likedBy", "dislikeBy"] });
        if(!comment){
            throw createError(404, `Comment does not exist`);
        }

        const hasLiked = comment.likedBy.some(likedUser => likedUser.userName === userName);
        const hasDisliked = comment.dislikeBy.some(dislikedUser => dislikedUser.userName === userName);

        if(!hasLiked){
            comment.likedBy.push(user);

            if(hasDisliked){
                comment.dislikeBy = comment.dislikeBy.filter(dislikedUser => dislikedUser.userName !== userName);
                comment.disLike -= 1;
            }

            comment.like += 1;

            await this.repository.save(comment);

            return "Comment liked";
        }else {
            comment.likedBy = comment.likedBy.filter(likedUser => likedUser.userName !== userName);


            comment.like = Math.max(0, comment.like -1);

            await this.repository.save(comment);
            console.log(comment.likedBy);
            return "Like removed from post";
        }
    }

    async addDislike(userName: string, commentId: number): Promise<string> {
        const user = await this.userRepository.findOne({where: {userName: userName}});
        if (!user) {
            throw createError(404, `User does not exist`);
        }

        const comment = await this.repository.findOne({where: {id: commentId}, relations: ["likedBy", "dislikeBy"]});
        if (!comment) {
            throw createError(404, `Comment does not exist`);
        }

        const hasLike = comment.likedBy.some(likedUser => likedUser.userName === userName);
        const hasDislike = comment.dislikeBy.some(dislikeUser => dislikeUser.userName === userName);

        if (!hasDislike) {
            comment.dislikeBy.push(user);

            if (hasLike) {
                comment.likedBy = comment.likedBy.filter(likedUser => likedUser.userName !== userName) || null;
                comment.like -= 1;
            }

            comment.disLike += 1;

            await this.repository.save(comment);

            return "comment disliked";
        } else {
            comment.dislikeBy = comment.dislikeBy.filter(dislikeUser => dislikeUser.userName !== userName) || null;

            comment.disLike = Math.max(0, comment.disLike -1);

            await this.repository.save(comment);

            return "Dislike removed from comment";
        }
    }

}