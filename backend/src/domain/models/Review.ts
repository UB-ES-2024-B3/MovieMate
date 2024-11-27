export class Review {
    constructor(
        private _id: number,
        private _title: string,
        private _review: string
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

    get review(): string {
        return this._review;
    }

    set review(value: string) {
        this._review = value;
    }

}