import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IPostRepository} from "../../domain/repositories/IPostRepository";
import {PostEntity} from "../entities/PostEntity";
import {PostDtoIn} from "../../interfaces/Interfaces";
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
        const authorFromDB = await this.userRepo.findOneBy({id: post.author});
        if (!authorFromDB) {
            throw createError(404, `User with username < ${post.author} > does not exist`);
        }

        const postToSave: PostEntity = new PostEntity();
        postToSave.title = post.title;
        postToSave.post = post.post;
        postToSave.image = post.image;
        postToSave.author = authorFromDB;

        // Save post using the repository
        await this.repository.save(postToSave);

        // Return a success message or the new review ID
        return "Post Published";
    }
}