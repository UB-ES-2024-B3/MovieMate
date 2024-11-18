import {NextFunction, Request, Response} from "express";
import {UserService} from "../../application/services/UserService";
import {autoInjectable, container} from "tsyringe";
import {UserRepository} from "../repositories/UserRepository";
import {User} from "../../domain/models/User";
import {DtoInValidation} from "../../interfaces/DtoInValidation";
import {isRight} from 'fp-ts/lib/Either';
import createError from "http-errors";
import {UpdateUserData} from "../../interfaces/Interfaces";

container.register(
    "IUserRepository", {
        useClass: UserRepository
    });

@autoInjectable()
export class UserController {

    private static userService: UserService = container.resolve(UserService);

    static async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body;

            // Validar los datos con la clase DtoIn
            const validationResult = DtoInValidation.validateUserDto(userData);

            if (!isRight(validationResult)) {
                // Si la validación falla, devolver un error
                throw createError(400, "Invalid user data!");
            }

            // Si la validación es correcta, accedemos a los datos validados
            const validatedData = validationResult.right;

            // Creación del objeto User con los datos validados
            const user: User = new User(
                null,
                validatedData.userName,
                validatedData.email,
                new Date(validatedData.birthDate),
                validatedData.password,
                validatedData.gender,
                null,
                validatedData.isAdmin,
            );

            const result = await this.userService.registerUser(user);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }

    }

    static async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userName = String(req.body.userName);
            const password = String(req.body.password);

            if (!userName || !password) {
                return res.status(400).json({ message: "Username and passwords are required" });
            }

            const result = await this.userService.loginUser(userName, password);
            return res.status(200).json(result);
        } catch(e) {
            return next(e);
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userName = req.params.userName;
            const result = await this.userService.deleteUser(userName);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {

        try {
            const userId = parseInt(req.params.userId)
            const userDataFromReq = req.body;

            // Validar los datos con la clase DtoIn
            const validationResult = DtoInValidation.validateUpdateUserDto(userDataFromReq);

            if (!isRight(validationResult)) {
                // Si la validación falla, devolver un error
                throw createError(400, "Invalid user data!");
            }

            // Si la validación es correcta, accedemos a los datos validados
            const validatedData = validationResult.right;

            // Creación del objeto User con los datos validados
            const userData: UpdateUserData = {
                userName: validatedData.userName,
                password: validatedData.password,
                gender: validatedData.gender,
                description: validatedData.description,
                email: validatedData.email
            };

            // Call the updateUser method in the UserService
            const result = await this.userService.updateUser(userId, userData);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userName = req.params.userName;
            const auth_token = req.headers.authorization?.split(" ")[1];
            const result = await this.userService.getUser(userName, auth_token);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}