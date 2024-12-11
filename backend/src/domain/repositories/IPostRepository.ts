import {PostDtoIn, PostDtoOut, UpdatePostData} from "../../interfaces/Interfaces";

export interface IPostRepository {
    create(post: PostDtoIn): Promise<string>;
    get(postId: number): Promise<PostDtoOut>;
    getAll(userName: string): Promise<{ allPosts: PostDtoOut[], likedPosts: number[], dislikedPosts: number[] }>;
    update(postId: number, post: UpdatePostData): Promise<string>;
    delete(postId: number): Promise<string>;
    addLike(userName: any, postID: number): Promise<string>;
    addDislike(userName: any, postId: number): Promise<string>;
}