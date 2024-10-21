import {Request, Response} from "express";
import {UserService} from "../../application/services/UserService";
import {autoInjectable, container} from "tsyringe";
import {UserRepository} from "../repositories/UserRepository";
import {User} from "../../domain/models/User";

container.register(
    "IUserRepository", {
        useClass: UserRepository
    });

@autoInjectable()
export class UserController {

    private static userService: UserService = container.resolve(UserService);

    static async registerUser(req: Request, res: Response) {
        try {
            const userData = req.body;

            // Creación del objeto User con los datos validados
            const user: User = new User(
                null,
                userData.userName,
                userData.email,
                new Date(userData.birthDate),
                userData.password,
                userData.gender,
                userData.isAdmin
            );

            const result = await this.userService.registerUser(user);
            return res.status(200).json(result);
        } catch(e) {
            return res.status(500).json({message: e.message});
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
        try{
            const userName = req.params.userName;
            const result = await this.userService.getUser(userName);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }
}