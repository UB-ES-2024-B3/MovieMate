export class User {
    constructor(
        private _id: number,
        private _userName: string,
        private _email: string,
        private _birthDate: Date,
        private _password: string,
        private _gender: string,
        private _isAdmin: boolean
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

}