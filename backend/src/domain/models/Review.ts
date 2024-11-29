import {User} from "./User";
import {Movie} from "./Movie";
import postgres from "postgres";

export class Review {
    constructor(
        private _id: number,
        private _title: string,
        private _review: string,
        private _author: User,
        private _movie: Movie
    ) {
    }

    get author(): User {
        return this._author;
    }

    set author(value: User) {
        this._author = value;
    }

    get movie(): Movie {
        return this._movie;
    }

    set movie(value: Movie) {
        this._movie = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get review(): string {
        return this._review;
    }

    set review(value: string) {
        this._review = value;
    }

}