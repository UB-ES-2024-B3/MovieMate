import {PostDtoOut, ReviewDtoOut, UserDtoOut} from "../../interfaces/Interfaces";
import {User} from "./User";
import {Post} from "./Post";
import {Review} from "./Review";


export class Comment {
    constructor(
        private _id: number,
        private _content: string,
        private _user: User | UserDtoOut,
        private _post?: Post,
        private _review?: Review,
        private _comment?: Comment
    ) {
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }

    get user(): User | UserDtoOut {
        return this._user;
    }

    set user(value: User | UserDtoOut) {
        this._user = value;
    }

    get post(): Post | PostDtoOut {
        return this._post;
    }

    set post(value: Post) {
        this._post = value;
    }

    get review(): Review | ReviewDtoOut {
        return this._review;
    }

    set review(value: Review) {
        this._review = value;
    }

    get comment(): Comment {
        return this._comment;
    }

    set comment(value: Comment) {
        this._comment = value;
    }

}