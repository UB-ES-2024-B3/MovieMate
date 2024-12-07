import {inject, injectable} from "tsyringe";
import {IPostRepository} from "../../domain/repositories/IPostRepository";
import {PostDtoIn, PostDtoOut} from "../../interfaces/Interfaces"

@injectable()
export class PostService {
    constructor(@inject("IPostRepository") private postRepository: IPostRepository) {
    }

    async createPost(post: PostDtoIn): Promise<string> {
        return await this.postRepository.create(post);
    }

    async getPost(postId: number): Promise<PostDtoOut> {
        return await this.postRepository.get(postId);
    }

    async getAllPosts(): Promise<PostDtoOut[]> {
        return await this.postRepository.getAll();
    }
}