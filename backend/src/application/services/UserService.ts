import {User} from "../../domain/models/User";
import {inject, injectable} from "tsyringe";
import {IUserRepository} from "../../domain/repositories/IUserRepository";

@injectable()
export class UserService {
    constructor(@inject("IUserRepository") private userRepository: IUserRepository) {
    }

    async  registerUser(user: User): Promise<string> {
        return await this.userRepository.register(user);
    }

    async deleteUser(userId: string) {
        return await this.userRepository.delete(userId);
    }

    async getUser(userId: string) {
        return await this.userRepository.get(userId);
    }
}