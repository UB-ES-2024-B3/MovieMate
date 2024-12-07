import {User} from "./User";
import {UserDtoOut} from "../../interfaces/Interfaces";
import Buffer from "buffer";
import {undefined} from "io-ts";
import {string} from "fp-ts";

export class Post {
    constructor(
        private _id: number,
        private _title: string,
        private _post: string,
        private _user: User | UserDtoOut,
        private _image?: Buffer
    ) {
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

    get post(): string {
        return this._post;
    }

    set post(value: string) {
        this._post = value;
    }

    get user(): User | UserDtoOut {
        return this._user;
    }

    set user(value: User | UserDtoOut) {
        this._user = value;
    }

    get image(): Buffer | undefined {
        // image como Buffer para ser compatible con PostEntity
        return this._image;
    }

    set image(value: Buffer | null) {
        this._image = value ?? null;
    }

    // Función para convertir la imagen a base64
    imageToBase64(): string | null {
        return this._image ? `data:image/jpeg;base64,${this._image.toString('base64')}` : null;
    }
}