export interface IUserRepository {
    delete(userName: string): Promise<string>;
}