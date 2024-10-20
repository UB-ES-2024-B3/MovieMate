import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {UserEntity} from "../entities/UserEntity";
import {User} from "../../domain/models/User";
import { createHash } from 'crypto';

export class UserRepository implements IUserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(UserEntity);
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        return await this.repository.findOne({ where: { email } });
    }

    async register(userData: { name: string, email: string, birthDate: Date, password: string, gender: string}): Promise<string> {

        const { name, email, birthDate, password, gender } = userData;

        // Validate required fields
        if (!name || !password || !email || !birthDate || !gender) {
            throw new Error("All fields are required");
        }


        // Check if the email is unique
        const existingUser = await this.getByEmail(email);
        if (existingUser) {
            throw new Error("Email is already registered.");
        }

        // Validate password complexity
        const passwordValid = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
        if (!passwordValid) {
            throw new Error("Password must be at least 8 characters long and include at least one number and one uppercase letter.");
        }

        // Hash the password
        const hashedPassword = createHash('sha256').update(password).digest('hex');

        // Create new user instance
        const newUser = new User(
            '',
            name,
            email,
            birthDate,
            hashedPassword,
            gender,
            false // default is false
        );

        // Save user using the repository
        await this.repository.save(newUser);

        // Return a success message or the new user's ID
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