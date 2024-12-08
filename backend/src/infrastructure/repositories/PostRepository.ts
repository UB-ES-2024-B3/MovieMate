import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IPostRepository} from "../../domain/repositories/IPostRepository";
import {PostEntity} from "../entities/PostEntity";
import {AuthorDtoOut, PostDtoIn, PostDtoOut, UpdatePostData} from "../../interfaces/Interfaces";
import {UserEntity} from "../entities/UserEntity";
import createError from "http-errors";


export class PostRepository implements IPostRepository {
    private readonly repository: Repository<PostEntity>;
    private readonly userRepo: Repository<UserEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(PostEntity);
        this.userRepo = PostgreTypeOrmDataSource.getRepository(UserEntity);
    }

    imageToBase64(image: Buffer | null): string | null {
        return image ? `data:image/jpeg;base64,${image.toString('base64')}` : null;
    }

    async create(post: PostDtoIn): Promise<string> {
        const authorFromDB = await this.userRepo.findOneBy({userName: post.author});
        if (!authorFromDB) {
            throw createError(404, `User with userName < ${post.author} > does not exist`);
        }

        const postToSave: PostEntity = new PostEntity();
        postToSave.title = post.title;
        postToSave.post = post.post;
        postToSave.image = post.image;
        postToSave.author = authorFromDB;
        postToSave.like = post.like;
        postToSave.disLike = post.disLike;



        // Save post using the repository
        await this.repository.save(postToSave);

        // Return a success message
        return "Post Published";
    }

    async get(postId: number): Promise<PostDtoOut> {
        const postFromDB = await this.repository.findOne({where: {id: postId},
        relations: ['author'],});

        if (!postFromDB) {
            throw createError(404, `Post does not exist`);
        }

        const author: AuthorDtoOut = {
            id: postFromDB.author.id,
            userName: postFromDB.author.userName,
            image: postFromDB.author.image ? this.imageToBase64(postFromDB.author.image) : null
        };


        const post: PostDtoOut = {
            id: postFromDB.id,
            title: postFromDB.title,
            createdAt: postFromDB.createdAt,
            post: postFromDB.post,
            author: author,
            image: postFromDB.image ? this.imageToBase64(postFromDB.image): null,
            like: postFromDB.like,
            disLike: postFromDB.disLike,
            totalComments: postFromDB.totalComments
        }

        return post;
    }

    async getAll(userName: string): Promise<{ allPosts: PostDtoOut[], likedPosts: number[], dislikedPosts: number[] }>{
        const postsFromDB = await this.repository.find({relations: ['author', 'likedBy', 'dislikeBy']});

        if (!postsFromDB) {
            throw createError(404, `No posts found`);
        }

        const likedPosts: number[] = [];
        const dislikedPosts: number[] = [];

        const allPosts = postsFromDB.map((post: PostEntity) => {
            const author: AuthorDtoOut = {
                id: post.author.id,
                userName: post.author.userName,
                image: post.author.image ? this.imageToBase64(post.author.image) : null
            };

            const posts: PostDtoOut = {
                id: post.id,
                title: post.title,
                createdAt: post.createdAt,
                post: post.post,
                author: author,
                image: post.image ? this.imageToBase64(post.image): null,
                like: post.like,
                disLike: post.disLike,
                totalComments: post.totalComments
            };

            if(post.likedBy?.some(user => user.userName == userName)){
                likedPosts.push(post.id);
            }

            if(post.dislikeBy?.some(user => user.userName === userName)){
                dislikedPosts.push(post.id);
            }

            return posts;
        });
        return {allPosts, likedPosts, dislikedPosts};
    }

    async update(postId: number, post: UpdatePostData): Promise<string> {
        const postFromDB = await this.repository.findOne({where: {id: postId},
        relations: ['author'],});

        if (!postFromDB) {
            throw createError(404, `Post does not exist`);
        }

        postFromDB.title = post.title || postFromDB.title;
        postFromDB.post = post.post || postFromDB.post;

        await this.repository.save(postFromDB);

        return "Post updated";
    }

    async delete(postId: number): Promise<string> {
        const postFromDB = await this.repository.findOne({where: {id: postId},
        relations: ['author'],});

        if (!postFromDB) {
            throw createError(404, `Post with id < ${postId} > does not exist`);
        }

        await this.repository.remove(postFromDB);

        return "Post Deleted";
    }

    async addLike(userName: string, postId: number): Promise<string>{
        const user = await this.userRepo.findOne({ where: { userName } });
        if(!user){
            throw createError(404, `User does not exist`);
        }

        const post = await this.repository.findOne({ where: { id: postId }, relations: ["likedBy", "dislikeBy"] });
        if(!post){
            throw createError(404, `Review does not exist`);
        }

        const hasLiked = post.likedBy.some(likedUser => likedUser.userName === userName);
        const hasDisliked = post.dislikeBy.some(dislikedUser => dislikedUser.userName === userName);

        if(!hasLiked){
            post.likedBy.push(user);

            if(hasDisliked){
                post.dislikeBy = post.dislikeBy.filter(dislikedUser => dislikedUser.userName !== userName);
                post.disLike -= 1;
            }

            post.like += 1;

            await this.repository.save(post);

            console.log(post.likedBy);

            return "Post liked";
        }else {
            post.likedBy = post.likedBy.filter(likedUser => likedUser.userName !== userName);


            post.like = Math.max(0, post.like -1);

            await this.repository.save(post);
            console.log(post.likedBy);
            return "Like removed from post";
        }
    }

    async addDislike(userName: string, postId: number): Promise<string> {
        const user = await this.userRepo.findOne({where: {userName: userName}});
        if (!user) {
            throw createError(404, `User does not exist`);
        }

        const post = await this.repository.findOne({where: {id: postId}, relations: ["likedBy", "dislikeBy"]});
        if (!post) {
            throw createError(404, `Review does not exist`);
        }

        const hasLike = post.likedBy.some(likedUser => likedUser.userName === userName);
        const hasDislike = post.dislikeBy.some(dislikeUser => dislikeUser.userName === userName);

        if (!hasDislike) {
            post.dislikeBy.push(user);

            if (hasLike) {
                post.likedBy = post.likedBy.filter(likedUser => likedUser.userName !== userName) || null;
                post.like -= 1;
            }

            post.disLike += 1;

            await this.repository.save(post);

            return "Post disliked";
        } else {
            post.dislikeBy = post.dislikeBy.filter(dislikeUser => dislikeUser.userName !== userName) || null;

            post.disLike = Math.max(0, post.disLike -1);

            await this.repository.save(post);

            return "Dislike removed from post";
        }
    }
}