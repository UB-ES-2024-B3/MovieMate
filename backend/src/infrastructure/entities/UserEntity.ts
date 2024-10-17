import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    userName: string;

    @Column({nullable: true})
    email: string;

    @Column({nullable: true})
    password: string;

    @Column({nullable: true})
    gender: string;

    @Column({nullable: true, type: "date"})
    birthDate: Date;
}