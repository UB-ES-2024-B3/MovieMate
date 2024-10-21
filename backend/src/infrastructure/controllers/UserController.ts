import {NextFunction, Request, Response} from "express";
import {UserService} from "../../application/services/UserService";
import {autoInjectable, container} from "tsyringe";
import {UserRepository} from "../repositories/UserRepository";
import {User} from "../../domain/models/User";
import {DtoInValidation} from "../../interfaces/DtoInValidation";
import {isRight} from 'fp-ts/lib/Either';

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
                return res.status(400).json({message: "Invalid user data!"});
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
                validatedData.isAdmin
            );

            const result = await this.userService.registerUser(user);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }

    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const userName = req.params.userName;
            const result = await this.userService.deleteUser(userName);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    static async getUser(req: Request, res: Response) {
        try {
            const userName = req.params.userName;
            const result = await this.userService.getUser(userName);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }
}