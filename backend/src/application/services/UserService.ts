import {User} from "../../domain/models/User";
import {inject, injectable} from "tsyringe";
import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {UpdateUserData} from '../../interfaces/Interfaces';

@injectable()
export class UserService {
    constructor(@inject("IUserRepository") private userRepository: IUserRepository) {
    }

    async registerUser(user: User): Promise<string> {
        return await this.userRepository.register(user);
    }

    async updateUser(userId: number, userData: UpdateUserData): Promise<string> {
        return await this.userRepository.update(userId, userData);
    }

    async loginUser(userName: string, password: string): Promise<string> {
        return await this.userRepository.login(userName, password);
    }

    async deleteUser(userId: string) {
        return await this.userRepository.delete(userId);
    }

    async getUser(userId: string, auth_token: string) {
        return await this.userRepository.get(userId, auth_token);
    }

    async sendRecoveryEmail(email: string): Promise<string> {
        return await this.userRepository.sendRecoveryEmail(email);
    }
}