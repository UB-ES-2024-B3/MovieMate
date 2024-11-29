import {Movie} from "./Movie";
import * as Buffer from "buffer";
import {undefined} from "io-ts";
import postgres from "postgres";
import {boolean, number, string} from "fp-ts";

export class User {
    constructor(
        private _id: number,
        private _userName: string,
        private _email: string,
        private _birthDate: Date,
        private _password: string,
        private _gender: string,
        private _description: string,
        private _isAdmin: boolean,
        private _image?: Buffer,
        private _favs?: Movie[] | null,
        private _reviewed?: Movie[] | null
    ) {
    }

    // Getters y setters
    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get name(): string {
        return this._userName;
    }

    set name(value: string) {
        this._userName = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get birthDate(): Date {
        return this._birthDate;
    }

    set birthDate(value: Date) {
        this._birthDate = value;
    }

    get gender(): string {
        return this._gender;
    }

    set gender(value: string) {
        this._gender = value;
    }

    get isAdmin(): boolean {
        return this._isAdmin;
    }

    set isAdmin(value: boolean) {
        this._isAdmin = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get image(): Buffer | undefined {
        // image como Buffer para ser compatible con UserEntity
        return this._image;
    }

    set image(value: Buffer | null) {
        this._image = value ?? null;
    }

    // Función para convertir la imagen a base64
    imageToBase64(): string | null {
        return this._image ? `data:image/jpeg;base64,${this._image.toString('base64')}` : null;
    }

    get favs(): Movie[] | null {
        return this._favs;
    }

    set favs(value: Movie[] | null) {
        this._favs = value;
    }

    get reviewed(): Movie[] | null {
        return this._reviewed;
    }

    set reviewed(value: Movie[] | null) {
        this._reviewed = value;
    }
}