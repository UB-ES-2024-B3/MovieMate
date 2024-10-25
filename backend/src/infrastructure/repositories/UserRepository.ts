import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {UserEntity} from "../entities/UserEntity";
import {User} from "../../domain/models/User";
import {createHash} from 'crypto';
import createError from 'http-errors';
import {UserUpdateData} from "../../interfaces/UserUpdateData";

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

    async update(userId: number, userData: UserUpdateData): Promise<string> {
        // Fetch the existing user
        const user = await this.repository.findOneBy({id:userId});
        if (!user) {
            throw new Error('User not found');
        }

        // Update the user's data
        if (userData.name) user.userName = userData.name;

        if (userData.password) {
            user.password = createHash('sha256').update(userData.password).digest('hex');
        }
        if (userData.gender) user.gender = userData.gender;

        // Save the updated user
        await this.repository.save(user);

        return 'User updated successfully';

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