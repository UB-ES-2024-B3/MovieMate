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

    async deleteUser(userId: string) {
        return await this.userRepository.delete(userId);
    }

    async getUser(userId: string) {
        return await this.userRepository.get(userId);
    }
}