import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique:true})
    userName: string;

    @Column({nullable: false, unique:true})
    email: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: false})
    gender: string;

    @Column({nullable: false, type: "date"})
    birthDate: Date;

    @Column({nullable: false, default: false})
    isAdmin: boolean;
}