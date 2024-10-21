import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {UserEntity} from "../entities/UserEntity";
import {User} from "../../domain/models/User";
import {createHash} from 'crypto';
import createError from 'http-errors';

export class UserRepository implements IUserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(UserEntity);
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        return await this.repository.findOne({ where: { email } });
    }

    async register(user: User): Promise<string> {

        const existingUser = await this.getByEmail(user.email);

        if (existingUser)
            throw createError(409, "Email is already registered");

        // Hash the password
        user.password = createHash('sha256').update(user.password).digest('hex');

        // Save user using the repository
        await this.repository.save(user);

        // Return a success message
        return "Registration successful";
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