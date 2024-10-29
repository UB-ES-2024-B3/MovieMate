import { describe, test, expect } from '@jest/globals';
import axios from 'axios';

const baseURL = 'http://localhost:3000/users'; // Cambia la URL según tu configuración

describe('UserController Integration Tests', () => {
    // Prueba de registrar usuario
    test('should register a user', async () => {
        const response = await axios.post(`${baseURL}/register`, {
            userName: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            birthDate: new Date(),
            gender: 'male',
            isAdmin: false,
        });

        expect(response.status).toBe(200);
        expect(response.data).toEqual({ message: 'Registration successful' });
    });

    // Caso de fallo: usuario ya existe
    test('should not register a user with existing username', async () => {
        await axios.post(`${baseURL}/register`, {
            userName: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            birthDate: new Date(),
            gender: 'male',
            isAdmin: false,
        });

        await expect(
            axios.post(`${baseURL}/register`, {
                userName: 'testuser',
                email: 'another@example.com',
                password: 'Password123!',
                birthDate: new Date(),
                gender: 'male',
                isAdmin: false,
            })
        ).rejects.toThrow();
    });

    // Caso de fallo: email ya registrado
    test('should not register a user with existing email', async () => {
        await axios.post(`${baseURL}/register`, {
            userName: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            birthDate: new Date(),
            gender: 'male',
            isAdmin: false,
        });

        await expect(
            axios.post(`${baseURL}/register`, {
                userName: 'anotheruser',
                email: 'test@example.com',
                password: 'Password123!',
                birthDate: new Date(),
                gender: 'female',
                isAdmin: false,
            })
        ).rejects.toThrow();
    });

    // Prueba de obtener usuario
    test('should get a user', async () => {
        await axios.post(`${baseURL}/register`, {
            userName: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            birthDate: new Date(),
            gender: 'male',
            isAdmin: false,
        });

        const response = await axios.get(`${baseURL}/testuser`);
        expect(response.status).toBe(200);
        expect(response.data.userName).toBe('testuser');
        expect(response.data.email).toBe('test@example.com');
    });

    // Caso de fallo: usuario no encontrado
    test('should return 404 for non-existent user', async () => {
        const response = await axios.get(`${baseURL}/nonexistentuser`).catch(err => err.response);
        expect(response.status).toBe(404);
        expect(response.data.error.message).toBe('User with username < nonexistentuser > does not exist');
    });

    // Prueba de iniciar sesión
    test('should login a user', async () => {
        await axios.post(`${baseURL}/register`, {
            userName: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            birthDate: new Date(),
            gender: 'male',
            isAdmin: false,
        });

        const response = await axios.post(`${baseURL}/login`, {
            userName: 'testuser',
            password: 'Password123!',
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('token'); // Asegúrate de que la respuesta tenga un token
    });

    // Caso de fallo: credenciales incorrectas
    test('should return 401 for incorrect login credentials', async () => {
        await axios.post(`${baseURL}/register`, {
            userName: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            birthDate: new Date(),
            gender: 'male',
            isAdmin: false,
        });

        const response = await axios.post(`${baseURL}/login`, {
            userName: 'testuser',
            password: 'WrongPassword',
        }).catch(err => err.response);

        expect(response.status).toBe(401);
        expect(response.data.error.message).toBe('Username or password are incorrect');
    });

    // Prueba de actualizar usuario
    test('should update a user', async () => {
        await axios.post(`${baseURL}/register`, {
            userName: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            birthDate: new Date(),
            gender: 'male',
            isAdmin: false,
        });

        const response = await axios.put(`${baseURL}/update/1`, { userName: 'updatedUser' });
        expect(response.status).toBe(200);
        expect(response.data).toEqual({ message: 'User updated successfully' });

        const updatedResponse = await axios.get(`${baseURL}/updatedUser`);
        expect(updatedResponse.data.userName).toBe('updatedUser');
    });

    // Caso de fallo: usuario no encontrado al actualizar
    test('should return 404 when trying to update a non-existent user', async () => {
        const response = await axios.put(`${baseURL}/update/999`, { userName: 'newName' }).catch(err => err.response);
        expect(response.status).toBe(404);
        expect(response.data.error.message).toBe('User with Id < 999 > does not exist');
    });

    // Prueba de borrar usuario
    test('should delete a user', async () => {
        await axios.post(`${baseURL}/register`, {
            userName: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            birthDate: new Date(),
            gender: 'male',
            isAdmin: false,
        });

        const response = await axios.delete(`${baseURL}/testuser`);
        expect(response.status).toBe(200);
        expect(response.data).toEqual({ message: 'user with username < testuser > deleted successfully' });

        await expect(axios.get(`${baseURL}/testuser`)).rejects.toThrow(); // Verifica que el usuario ya no existe
    });

    // Caso de fallo: usuario no encontrado al borrar
    test('should return 404 when trying to delete a non-existent user', async () => {
        const response = await axios.delete(`${baseURL}/nonexistentuser`).catch(err => err.response);
        expect(response.status).toBe(404);
        expect(response.data.error.message).toBe('User with username < nonexistentuser > does not exist');
    });
});
