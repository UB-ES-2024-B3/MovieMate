import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
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

    @Column({default: 0})
    like: number;

    @Column({default: 0})
    disLike: number;
  
    @Column({default: 0})
    totalComments: number;

    @ManyToOne(type => MovieEntity)
    movie: MovieEntity;

    @ManyToOne(type => UserEntity)
    author: UserEntity;

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    likedBy: UserEntity[];

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    dislikeBy: UserEntity[];
}