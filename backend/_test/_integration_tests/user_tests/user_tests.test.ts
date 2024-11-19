import { describe, expect, test } from '@jest/globals';
import axios from 'axios';

const baseURL = 'http://localhost:3000/user'; // Cambia la URL según tu configuración
let userId;
describe('User Tests', () => {

    describe('Registration Tests', () => {
        // Prueba de registrar usuario
        test('should register a user', async () => {
            try {
                const response = await axios.post(`${baseURL}/register`, {
                    userName: 'testuser',
                    email: 'test@example.com',
                    password: 'Password123!',
                    birthDate: '2002-11-17',
                    gender: 'male',
                    isAdmin: false,
                });
                expect(response.status).toBe(200);
                expect(response.data).toEqual("Registration successful");
            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error.message);
            }
        });

        // Caso de fallo: usuario ya existe
        test('should not register a user with existing username', async () => {
            await axios.post(`${baseURL}/register`, {
                userName: 'testuser', // Mismo nombre de usuario
                email: 'another@example.com',
                password: 'Password123!',
                birthDate: new Date(),
                gender: 'male',
                isAdmin: false,
            }).catch(err => {
                expect(err.response.status).toBe(409); // Verifica el código de estado
                expect(err.response.data.error.message).toBe('UserName is already in use.'); // Verifica el mensaje de error
                expect(err.response.data.error.status).toBe(409); // Verifica el status en el cuerpo de error
            });
        });

        // Caso de fallo: email ya registrado
        test('should not register a user with existing email', async () => {
            await axios.post(`${baseURL}/register`, {
                userName: 'anotheruser',
                email: 'test@example.com',
                password: 'Password123!',
                birthDate: '2002-11-17',
                gender: 'male',
                isAdmin: false,
            }).catch(err => {
                expect(err.response.status).toBe(409); // Verifica el código de estado
                expect(err.response.data.error.message).toBe('Email is already registered.'); // Verifica el mensaje de error
                expect(err.response.data.error.status).toBe(409); // Verifica el status en el cuerpo de error
            });
        });
    });

    describe('Get Tests', () => {
        // Prueba de obtener usuario
        test('should get a user', async () => {
            const response = await axios.get(`${baseURL}/testuser`);
            expect(response.status).toBe(200);

            // Un poco feo pero aqui debemos guardarnos el user id para poder hacer el update luego
            userId = response.data.user.id.toString();
            // Verifica que los datos del usuario sean correctos
            expect(response.data.user.userName).toBe('testuser');
            expect(response.data.user.email).toBe('test@example.com');
            expect(response.data.user.birthDate).toBe('2002-11-17');
            expect(response.data.user.gender).toBe('male');
            expect(response.data.user.description).toBeNull();
            expect(response.data.user.isAdmin).toBe(false);
        });

        // Caso de fallo: usuario no encontrado
        test('should return 404 for non-existent user', async () => {
            const response = await axios.get(`${baseURL}/nonexistentuser`).catch(err => err.response);
            expect(response.status).toBe(404);
            expect(response.data.error.message).toBe('User with username < nonexistentuser > does not exist');
        });
    });

    describe('Login Tests', () => {
        // Prueba de iniciar sesión
        test('should login a user', async () => {
            const response = await axios.post(`${baseURL}/login`, {
                userName: 'testuser',
                password: 'Password123!',
            });

            expect(response.status).toBe(200);
            expect(typeof response.data).toBe('string'); // Verifica que la respuesta sea una cadena
            expect(response.data).not.toBe(''); // Asegúrate de que el token no sea una cadena vacía
        });

        // Caso de fallo: credenciales incorrectas
        test('should return 401 for incorrect login credentials', async () => {
            const response = await axios.post(`${baseURL}/login`, {
                userName: 'testuser',
                password: 'WrongPassword',
            }).catch(err => err.response);

            expect(response.status).toBe(401);
            expect(response.data.error.message).toBe('Username or password are incorrect');
        });
    });

    describe('Update Tests', () => {
        // Prueba de actualización de un usuario existente
        test('should update an existing user', async () => {
            const url= `${baseURL}/update/${userId}`
            const response = await axios.put(url, { userName: 'updatedUser' }).catch(err => err.response);
            expect(response.status).toBe(200);

            const updatedResponse = await axios.get(`${baseURL}/updatedUser`);
            expect(updatedResponse.data.user.userName).toBe('updatedUser');
        });

        // Caso de fallo: usuario no encontrado al actualizar
        test('should return 404 when trying to update a non-existent user', async () => {
            const response = await axios.put(`${baseURL}/update/999`, { userName: 'newName' }).catch(err => err.response);
            expect(response.status).toBe(404);
            expect(response.data.error.message).toBe('User with Id < 999 > does not exist');
        });
    });


    describe('Delete Tests', () => {
        // Prueba de borrar usuario
        test('should delete a user', async () => {
            const response = await axios.delete(`${baseURL}/updatedUser`);
            expect(response.status).toBe(200);
            expect(response.data).toEqual("user with username < updatedUser > deleted successfully");

            await expect(axios.get(`${baseURL}/updatedUser`)).rejects.toThrow(); // Verifica que el usuario ya no existe
        });

        // Caso de fallo: usuario no encontrado al borrar
        test('should return 404 when trying to delete a non-existent user', async () => {
            const response = await axios.delete(`${baseURL}/nonexistentuser`).catch(err => err.response);
            expect(response.status).toBe(404);
            expect(response.data.error.message).toBe('User with username < nonexistentuser > does not exist');
        });
    });
});
