import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import {MovieEntity} from "./MovieEntity";  // Asegúrate de importar MovieEntity

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
    @ManyToMany(() => MovieEntity)
    @JoinTable()  // La tabla intermedia será creada automáticamente
    favs: MovieEntity[];
}
