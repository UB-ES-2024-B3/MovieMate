export class Movie {

    constructor(
        private _id: number,
        private _title: string,
        private _description: string,
        private _genres: string[],
        private _directors: string[],
        private _actors: string[],
        private _premiereDate: Date,
        private _duration: number,
        private _classification: string,
        private _score: number,
        private _totalReviews: number,
        private _image?: Buffer | string
    ) {
    }

    //Getters y setters
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

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get genres(): string[] {
        return this._genres;
    }

    set genres(value: string[]) {
        this._genres = value;
    }

    get directors(): string[] {
        return this._directors;
    }

    set directors(value: string[]) {
        this._directors = value;
    }

    get actors(): string[] {
        return this._actors;
    }

    set actors(value: string[]) {
        this._actors = value;
    }

    get premiereDate(): Date {
        return this._premiereDate;
    }

    set premiereDate(value: Date) {
        this._premiereDate = value;
    }

    get duration(): number {
        return this._duration;
    }

    set duration(value: number) {
        this._duration = value;
    }

    get classification(): string {
        return this._classification;
    }

    set classification(value: string) {
        this._classification = value;
    }

    get score(): number {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
    }

    get image(): Buffer | string | undefined {
        // image como Buffer para ser compatible con UserEntity
        return this._image;
    }

    set image(value: Buffer | null) {
        this._image = value ?? undefined;
    }

}