import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {UserEntity} from "../entities/UserEntity";
import {User} from "../../domain/models/User";
import {createHash} from 'crypto';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export class UserRepository implements IUserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(UserEntity);
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        return await this.repository.findOne({where: {email}});
    }

    async register(user: User): Promise<string> {
        // Check if the username is unique
        const existingUserName = await this.repository.findOneBy({userName: user.name});
        if (existingUserName) {
            throw createError(409, "UserName is already in use.");
        }

        // Check if the email is unique
        const existingEmail = await this.getByEmail(user.email);
        if (existingEmail) {
            throw createError(409, "Email is already registered.");
        }

        // Hash the password
        user.password = createHash('sha256').update(user.password).digest('hex');

        // Save user using the repository
        await this.repository.save(user);

        // Return a success message or the new user's ID
        return "Registration successful";
    }

    async login(user: User): Promise<string> {
        const existingUser = await this.getByEmail(user.email);

        const hashedPassword = createHash('sha256').update(user.password).digest('hex');

        if (!existingUser || existingUser.password != hashedPassword) {
            throw createError(401, "Email or password are incorrect");
        }
        const secretKey = 'ES-UB-B3'
        const token = jwt.sign({email: existingUser.email}, secretKey);

        return token;
    }


    async delete(userName: string): Promise<string> {
        const userFromDB = await this.repository.findOneBy({userName: userName});
        if (!userFromDB) {
            throw createError(404, `User with username < ${userName} > does not exist`);
        }
        await this.repository.remove(userFromDB)
        return `user with username < ${userName} > deleted successfully`
    }

    async get(userName: string): Promise<User> {
        const userFromDB = await this.repository.findOneBy({userName: userName});
        if (!userFromDB) {
            throw createError(404, `User with username < ${userName} > does not exist`);
        }
        return new User(
            userFromDB.id,
            userFromDB.userName,
            userFromDB.email,
            userFromDB.birthDate,
            userFromDB.password,
            userFromDB.gender,
            userFromDB.isAdmin
        );
    }

}