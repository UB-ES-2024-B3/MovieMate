import {PostDtoIn, PostDtoOut} from "../../interfaces/Interfaces";

export interface IPostRepository {
    create(post: PostDtoIn): Promise<string>;
    get(postId: number): Promise<PostDtoOut>;
    getAll(): Promise<PostDtoOut[]>;

}