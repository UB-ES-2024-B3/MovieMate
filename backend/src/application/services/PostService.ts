import {inject, injectable} from "tsyringe";
import {IPostRepository} from "../../domain/repositories/IPostRepository";

import {PostDtoIn, PostDtoOut, UpdatePostData} from "../../interfaces/Interfaces"


@injectable()
export class PostService {
    constructor(@inject("IPostRepository") private postRepository: IPostRepository) {
    }

    async createPost(post: PostDtoIn): Promise<string> {
        return await this.postRepository.create(post);
    }

    async getPost(postId: number): Promise<{post: PostDtoOut, likedUsers: string[], dislikedUsers: string[] }> {
        return await this.postRepository.get(postId);
    }

    async getAllPosts(userName: string): Promise<{ allPosts: PostDtoOut[], likedPosts: number[], dislikedPosts: number[] }> {
        return await this.postRepository.getAll(userName);
    }

    async updatePost(postId: number, post: UpdatePostData): Promise<string> {
        return await this.postRepository.update(postId, post);
    }

    async deletePost(postId: number): Promise<string> {
        return await this.postRepository.delete(postId);
    }

    async addLike(userName: any, postID: number) {
        return await this.postRepository.addLike(userName, postID);

    }

    async addDislike(userName: any, postId: number) {
        return await this.postRepository.addDislike(userName, postId);
    }
}