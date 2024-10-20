import { v4 as uuidv4 } from 'uuid';

export class User {
    constructor(
        private _id: string = uuidv4(),
        private _name: string,
        private _email: string,
        private _birthDate: Date,
        private _password: string,
        private _gender: string,
        private _isAdmin: boolean
    ) {
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    public changeEmail(newEmail: string): void {
        if (!this.isValidEmail(newEmail)) {
            throw new Error('Invalid email');
        }
        this.email = newEmail
    }

    public isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    get isAdmin(): boolean {
        return this._isAdmin;
    }

    set isAdmin(value: boolean) {
        this._isAdmin = value;
    }

}