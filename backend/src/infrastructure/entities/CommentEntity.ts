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
import {UserEntity} from "./UserEntity";
import {PostEntity} from "./PostEntity";
import {ReviewEntity} from "./ReviewEntity";

@Entity()
export class CommentEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    content: string;

    @CreateDateColumn({type: "timestamp"}) // Autogenera la fecha y hora
    createdAt: Date;

    @Column({default: 0})
    totalComments: number;

    @ManyToOne(type => UserEntity)
    author: UserEntity;

    @ManyToOne(type => ReviewEntity)
    review: ReviewEntity;

    @ManyToOne(type => PostEntity)
    post: PostEntity;

    @ManyToOne(type => CommentEntity)
    comment: CommentEntity;
}
