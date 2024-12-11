import 'reflect-metadata';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { UserService } from '../../src/application/services/UserService';
import { User } from '../../src/domain/models/User';
import {UpdateUserData, UserDtoOut} from '../../src/interfaces/Interfaces';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository';
// @ts-ignore
import createError from 'http-errors';

// Mock del repositorio
const mockUserRepository: jest.Mocked<IUserRepository> = {
    register: jest.fn(),
    update: jest.fn(),
    updateUserImage: jest.fn(),
    login: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    sendRecoveryEmail: jest.fn(),
    recoverPassword: jest.fn(),
    search: jest.fn(),
    getAllFavorites: jest.fn(),
    follow: jest.fn(),
    getFollowers: jest.fn(),
};

describe('UserService Unit Tests', () => {
    let userService: UserService;

    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
        userService = new UserService(mockUserRepository); // Inyecta el mock
    });

    describe('registerUser', () => {
        it('should register a user successfully', async () => {
            const newUser = new User(
                1,
                'testuser',
                'test@example.com',
                new Date('2002-11-17'),
                'hashedPassword123!',
                'male',
                'This is a test user',
                false,
            );

            mockUserRepository.register.mockResolvedValue('Registration successful');

            const result = await userService.registerUser(newUser);

            expect(result).toBe('Registration successful');
            expect(mockUserRepository.register).toHaveBeenCalledWith(newUser);
        });

        it('should throw an error if username is already in use', async () => {
            const newUser = new User(
                1,
                'testuser',
                'test@example.com',
                new Date('2002-11-17'),
                'hashedPassword123!',
                'male',
                'This is a test user',
                false
            );

            mockUserRepository.register.mockRejectedValue(createError(409, 'UserName is already in use.'));

            await expect(userService.registerUser(newUser)).rejects.toThrow('UserName is already in use.');
        });

        it('should throw an error if email is already registered', async () => {
            const newUser = new User(
                1,
                'anotheruser',
                'test@example.com', // Email repetido
                new Date('2002-11-17'),
                'hashedPassword123!',
                'male',
                'This is another test user',
                false
            );

            mockUserRepository.register.mockRejectedValue(createError(409, 'Email is already registered.'));

            await expect(userService.registerUser(newUser)).rejects.toThrow('Email is already registered.');
        });
    });

    describe('updateUser', () => {
        it('should update a user successfully', async () => {
            const userId = 1;
            const updateData: UpdateUserData = { userName: 'updatedUser' };

            mockUserRepository.update.mockResolvedValue('Update successful');

            const result = await userService.updateUser(userId, updateData);

            expect(result).toBe('Update successful');
            expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
        });

        it('should throw an error if user does not exist', async () => {
            const userId = 999;
            const updateData: UpdateUserData = { userName: 'updatedUser' };

            mockUserRepository.update.mockRejectedValue(createError(404, `User with Id < ${userId} > does not exist`));

            await expect(userService.updateUser(userId, updateData)).rejects.toThrow(
                `User with Id < ${userId} > does not exist`
            );
        });
    });

    describe('loginUser', () => {
        it('should login successfully and return a token', async () => {
            const userName = 'testuser';
            const password = 'Password123!';

            mockUserRepository.login.mockResolvedValue('mock-token');

            const result = await userService.loginUser(userName, password);

            expect(result).toBe('mock-token');
            expect(mockUserRepository.login).toHaveBeenCalledWith(userName, password);
        });

        it('should throw an error for incorrect credentials', async () => {
            const userName = 'testuser';
            const password = 'WrongPassword';

            mockUserRepository.login.mockRejectedValue(createError(401, 'Username or password are incorrect'));

            await expect(userService.loginUser(userName, password)).rejects.toThrow(
                'Username or password are incorrect'
            );
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            const userId = '1';

            mockUserRepository.delete.mockResolvedValue('User deleted successfully');

            const result = await userService.deleteUser(userId);

            expect(result).toBe('User deleted successfully');
            expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
        });

        it('should throw an error if user does not exist', async () => {
            const userId = '999';

            mockUserRepository.delete.mockRejectedValue(createError(404, `User with username < ${userId} > does not exist`));

            await expect(userService.deleteUser(userId)).rejects.toThrow(
                `User with username < ${userId} > does not exist`
            );
        });
    });

    describe('getUser', () => {
        it('should return user data successfully', async () => {
            const userId = '1';
            const authToken = 'mock-auth-token';
            const mockUser = {
                id: 1,
                userName: 'testuser',
                email: 'test@example.com',
                password: 'Password123!',
                birthDate: new Date('2002-11-17'),
                gender: 'male',
                description: null,
                isAdmin: false,
                image: null,
                totalFollowers: 0,
                totalFollowing: 0,
            };

            mockUserRepository.get.mockResolvedValue({ user: mockUser, isOwnProfile: true, reviews:[], posts:[], });

            const result = await userService.getUser(userId, authToken);

            expect(result.user.id).toBe(1);
            expect(result.user.userName).toBe('testuser');
            expect(result.user.email).toBe('test@example.com');
            expect(result.isOwnProfile).toBe(true);
            expect(mockUserRepository.get).toHaveBeenCalledWith(userId, authToken);
        });

        it('should throw an error if user does not exist', async () => {
            const userId = '999';
            const authToken = 'mock-auth-token';

            mockUserRepository.get.mockRejectedValue(createError(404, `User with username < ${userId} > does not exist`));

            await expect(userService.getUser(userId, authToken)).rejects.toThrow(
                `User with username < ${userId} > does not exist`
            );
        });
    });
});
