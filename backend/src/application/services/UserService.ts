import {User} from "../../domain/models/User";
import {inject, injectable} from "tsyringe";
import {IUserRepository} from "../../domain/repositories/IUserRepository";

@injectable()
export class UserService {
    constructor(@inject("IUserRepository") private userRepository: IUserRepository) {
    }

    async  registerUser(userData: { name: string, email: string, birthDate: Date, password: string, gender: string}): Promise<string> {
        return await this.userRepository.register(userData);
    }

    async deleteUser(userId: string) {
        return await this.userRepository.delete(userId);
    }

    async getUser(userId: string) {
        return await this.userRepository.get(userId);
    }
}