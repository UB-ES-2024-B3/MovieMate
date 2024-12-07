import {PostDtoIn} from "../../interfaces/Interfaces";

export interface IPostRepository {
    create(post: PostDtoIn): Promise<string>;
}