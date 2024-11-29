import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {MovieEntity} from "./MovieEntity";
import {UserEntity} from "./UserEntity";

@Entity()
export class ReviewEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: true})
    review: string;

    @ManyToOne(type => MovieEntity)
    movie: MovieEntity;

    @ManyToOne(type => UserEntity)
    author: UserEntity;
}