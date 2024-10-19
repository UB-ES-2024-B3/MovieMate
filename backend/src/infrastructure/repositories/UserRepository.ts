import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {UserEntity} from "../entities/UserEntity";
import {User} from "../../domain/models/User";

export class UserRepository implements IUserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(UserEntity);
    }

    async delete(userName: string): Promise<string> {
        const userFromDB = await this.repository.findOneBy({userName: userName});
        if (!userFromDB) {
            throw new Error(`user with username < ${userName} > does not exist`)
        }
        await this.repository.remove(userFromDB)
        return `user with username < ${userName} > deleted successfully`
    }

    async get(userName: string): Promise<User> {
        const userFromDB = await this.repository.findOneBy({userName: userName});
        if (!userFromDB) {
            throw new Error(`user with username < ${userName} > does not exist`)
        }
        const user: User = new User(
            userFromDB.id,
            userFromDB.userName,
            userFromDB.password,
            userFromDB.birthDate,
            userFromDB.email,
            userFromDB.gender,
            userFromDB.isAdmin
        )
        return user;
    }

}