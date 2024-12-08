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
import {MovieEntity} from "./MovieEntity";

@Entity()
export class PostEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: true})
    post: string;

    @CreateDateColumn({type: "timestamp"}) // Autogenera la fecha y hora
    createdAt: Date;

    @Column({type: 'bytea', nullable: true})
    image: Buffer;

    @ManyToOne(type => UserEntity)
    author: UserEntity;

    @Column({default: 0})
    like: number;

    @Column({default: 0})
    disLike: number;

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    likedBy: UserEntity[];

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    dislikeBy: UserEntity[];
}