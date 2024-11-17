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
        private _image?: Buffer
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
        this._image = value ?? undefined;
    }

    // Función para convertir la imagen a base64
    imageToBase64(): string | null {
        return this._image ? `data:image/jpeg;base64,${this._image.toString('base64')}` : null;
    }

}