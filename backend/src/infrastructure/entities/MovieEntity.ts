import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class MovieEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: false})
    genres: string[];

    @Column({nullable: false})
    directors: string[];

    @Column({nullable: false})
    actors: string[];

    @Column({nullable: false, type: "date"})
    premiereDate: Date;

    @Column({nullable: false})
    duration: number;

    @Column({nullable: true})
    classification: string;

    @Column({nullable: true, type: "float"})
    score: number;

    @Column({nullable: true})
    totalReviews: number;

    @Column({type: 'bytea', nullable: true})
    image: Buffer;

}