import axios from 'axios';
import { createTestUser, deleteTestUser, getUserTest } from '../../test_utils/testUtilsUsers';
import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';

const baseURL = 'http://localhost:3000/user';

let userId: string;
let userName: string;

describe('Delete Tests', () => {
    beforeAll(async () => {
        const existingUser = await getUserTest('TestUser');
        if (!existingUser) {
            const user = await createTestUser();
            userName = user.user.userName;
            userId = user.user.id;
        } else {
            userName = existingUser.user.userName;
            userId = existingUser.user.id;
        }
    });

    test('should delete a user', async () => {
        try {
            if (!userName) {
                throw new Error('userName no está definido, no se puede ejecutar la prueba.');
            }

            const deleteResponse = await axios.delete(`${baseURL}/${userName}`);
            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.data).toBe(`user with username < ${userName} > deleted successfully`);

            // Verificar que el usuario ya no exista
            const user = await getUserTest(userName);
            expect(user).toBeNull();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error.response?.data || error.message);
            throw error;
        }
    });

    test('should return 404 when trying to delete a non-existent user', async () => {
        const nonExistentUserName = 'nonExistentUser';

        try {
            // Intenta eliminar un usuario inexistente
            await axios.delete(`${baseURL}/${nonExistentUserName}`);
        } catch (error) {
            // Verificar el código de estado y el mensaje de error
            if (error.response) {
                expect(error.response.status).toBe(404);
                expect(error.response.data.error.message).toBe(`User with username < ${nonExistentUserName} > does not exist`);
            } else {
                console.error('Error inesperado:', error.message);
                throw error;
            }
        }
    });
});