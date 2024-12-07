import {PostDtoIn, PostDtoOut, UpdatePostData} from "../../interfaces/Interfaces";

export interface IPostRepository {
    create(post: PostDtoIn): Promise<string>;
    get(postId: number): Promise<PostDtoOut>;
    getAll(): Promise<PostDtoOut[]>;
    update(postId: number, post: UpdatePostData): Promise<string>;
}