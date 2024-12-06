import {inject, injectable} from "tsyringe";
import {IPostRepository} from "../../domain/repositories/IPostRepository";
import {PostDtoIn} from "../../interfaces/Interfaces"

@injectable()
export class PostService {
    constructor(@inject("IPostRepository") private postRepository: IPostRepository) {
    }

    async createPost(post: PostDtoIn): Promise<string> {
        return await this.postRepository.create(post);
    }
}