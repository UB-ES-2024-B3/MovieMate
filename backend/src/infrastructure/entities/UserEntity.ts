import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    userName: string;

    @Column({nullable: false})
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