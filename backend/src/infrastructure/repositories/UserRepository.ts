import {Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {UserEntity} from "../entities/UserEntity";
import {User} from "../../domain/models/User";
import {createHash} from 'crypto';
import createError from 'http-errors';
import {UpdateUserData, UserWithProfileInfo} from "../../interfaces/Interfaces";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export class UserRepository implements IUserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(UserEntity);
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        return await this.repository.findOne({where: {email}});
    }

    async getByUsername(userName: string): Promise<UserEntity | null> {
        return await this.repository.findOne({where: {userName}});
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

    async update(userId: number, userData: UpdateUserData): Promise<string> {
        // Fetch the existing user
        const userFromBD = await this.repository.findOneBy({id: userId});
        if (!userFromBD) {
            throw createError(404, `User with Id < ${userId} > does not exist`);
        }
        if (userData.email) {// Check if the email is unique
            const existingEmail = await this.repository.findOneBy({email: userData.email});
            if (existingEmail && existingEmail.id != userId) {
                throw createError(409, "Email is already registered.");
            }
        }
        if (userData.userName) {
            // Check if the username is unique
            const existingUserName = await this.repository.findOneBy({userName: userData.userName});
            if (existingUserName && existingUserName.id != userId) {
                throw createError(409, "UserName is already in use.");
            }
        }
        if (userData.password) {
            // Hash the password
            userData.password = createHash('sha256').update(userData.password).digest('hex');
        }
        userFromBD.userName = userData.userName || userFromBD.userName
        userFromBD.description = userData.description || userFromBD.description
        userFromBD.gender = userData.gender || userFromBD.gender
        userFromBD.password = userData.password || userFromBD.password
        userFromBD.email = userData.email || userFromBD.email

        // Save the updated user
        await this.repository.save(userFromBD);

        // Update token
        const secretKey = 'ES-UB-B3'
        const token = jwt.sign({userName: userFromBD.userName}, secretKey);

        return token;

    }

    async login(userName: string, password: string): Promise<string> {
        const existingUser = await this.getByUsername(userName);

        const hashedPassword = createHash('sha256').update(password).digest('hex');

        if (!existingUser || existingUser.password != hashedPassword) {
            throw createError(401, "Username or password are incorrect");
        }
        const secretKey = 'ES-UB-B3'
        const token = jwt.sign({userName: existingUser.userName}, secretKey);

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

    async get(userName: string, auth_token: string): Promise<UserWithProfileInfo> {
        const userFromDB = await this.repository.findOneBy({userName: userName});
        if (!userFromDB) {
            throw createError(404, `User with username < ${userName} > does not exist`);
        }

        const user = new User(
            userFromDB.id,
            userFromDB.userName,
            userFromDB.email,
            userFromDB.birthDate,
            userFromDB.password,
            userFromDB.gender,
            userFromDB.description,
            userFromDB.isAdmin,
        );

        const decoded = jwt.decode(auth_token) as jwt.JwtPayload;

        let isOwnProfile = false;

        if (decoded != null && decoded.userName == user.userName) {
            isOwnProfile = true;
        }

        return {user, isOwnProfile};
    }

    async sendRecoveryEmail(email: string): Promise<string> {
        const userFromDB = await this.repository.findOneBy({email: email});
        if (!userFromDB) {
            throw createError(404, "User with email < ${email} > does not exist");
        }
        const secretKey = 'ES-UB-B3'
        const token = jwt.sign({email: userFromDB.email}, secretKey, {expiresIn: '1h'});

        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port:587,
            secure: false,
            auth: {
                user: 'moviemate@zohomail.eu',
                pass: 'Movie#1234ADJLMN'
            }
        });

        await transporter.sendMail({
            from: 'moviemate@zohomail.eu',
            to: email,
            subject: 'Password Recovery',
            html: '<p> Click<a href="http://localhost:3000/user/passwordRecovery?token=${token}">here</a> to reset your password.</p>'
        });

        return 'Email enviat';
    }

}