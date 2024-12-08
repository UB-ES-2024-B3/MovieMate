import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {MovieEntity} from "./MovieEntity";
import {PostEntity} from "./PostEntity"; // Asegúrate de importar MovieEntity

@Entity()
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    userName: string;

    @Column({nullable: false, unique: true})
    email: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: false})
    gender: string;

    @Column({nullable: false, type: "date"})
    birthDate: Date;

    @Column({nullable: true})
    description: string;

    @Column({nullable: false, default: false})
    isAdmin: boolean;

    @Column({type: 'bytea', nullable: true})
    image: Buffer;

    // Relación ManyToMany con MovieEntity
    @ManyToMany(() => MovieEntity, {nullable: true})
    @JoinTable()  // La tabla intermedia se crea aquí
    favs: MovieEntity[] | null; // Permitir que 'favs' sea null

    @ManyToMany(() => MovieEntity, {nullable: true})
    @JoinTable()  // La tabla intermedia se crea aquí
    reviewed: MovieEntity[] | null;

    @ManyToMany(() => UserEntity, (user) => user.following, { nullable: true })
    followers: UserEntity[] | null;

    @ManyToMany(() => UserEntity, (user) => user.followers, { nullable: true })
    @JoinTable() // La tabla intermedia se crea aquí
    following: UserEntity[] | null;

    @ManyToMany(type => PostEntity, post => post.likedBy)
    likedPosts: PostEntity[];

    @ManyToMany(type => PostEntity, post => post.dislikeBy)
    dislikedPosts: PostEntity[];
}
