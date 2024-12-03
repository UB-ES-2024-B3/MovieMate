import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
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

    @CreateDateColumn({type: "timestamp"}) // Autogenera la fecha y hora
    createdAt: Date;

    @ManyToOne(type => MovieEntity)
    movie: MovieEntity;

    @ManyToOne(type => UserEntity)
    author: UserEntity;
}