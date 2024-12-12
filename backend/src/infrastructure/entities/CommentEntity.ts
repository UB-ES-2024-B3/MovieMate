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

    @Column({default: 0})
    like: number;

    @Column({default: 0})
    disLike: number;

    @ManyToOne(type => UserEntity)
    author: UserEntity;

    @ManyToOne(type => ReviewEntity)
    review: ReviewEntity;

    @ManyToOne(type => PostEntity)
    post: PostEntity;

    @ManyToOne(type => CommentEntity)
    comment: CommentEntity;

    @ManyToMany(type => UserEntity,user => user.likedComment,  { cascade: true })
    @JoinTable()
    likedBy: UserEntity[];

    @ManyToMany(type => UserEntity,user => user.dislikedComment,  { cascade: true })
    @JoinTable()
    dislikeBy: UserEntity[];
}
