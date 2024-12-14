import request from 'supertest';
import app from '../../../src/main/app'; // Ajusta esta ruta según tu proyecto
import { createTestUser, deleteTestUser, getUserTest } from '../../test_utils/testUtilsUsers';
import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import {PostgreTypeOrmDataSource} from "../../../src/main/config/postgreDatabaseTypeOrm";

describe('Followers Functional Tests', () => {
  let userName: string;
  let userId: string;
  let userName2: string;
  let userId2: string;

  beforeAll(async () => {
        if (!PostgreTypeOrmDataSource.isInitialized) {
          await PostgreTypeOrmDataSource.initialize();
        }
        // Crear o recuperar el primer usuario
        const existingUser = await getUserTest('TestUser');
        if (!existingUser) {
          const user = await createTestUser();
          userName = user.user.userName;
          userId = user.user.id;
        } else {
          userName = existingUser.user.userName;
          userId = existingUser.user.id;
        }

        // Crear o recuperar el segundo usuario
        const existingUser2 = await getUserTest('TestUser2');
        if (!existingUser2) {
          const user2 = await createTestUser({
            userName: 'TestUser2',
            email: 'test2@example.com',
            password: '1234#User',
            birthDate: '2000-02-02',
            gender: 'male',
            isAdmin: false,
          });
          userName2 = user2.user.userName;
          userId2 = user2.user.id;
        } else {
          userName2 = existingUser2.user.userName;
          userId2 = existingUser2.user.id;
        }
  });

  afterAll(async () => {
      if (PostgreTypeOrmDataSource.isInitialized) {
          await PostgreTypeOrmDataSource.destroy();
      }
      await deleteTestUser(userName);
      await deleteTestUser(userName2);
  });

  test('should follow one user to another user', async () => {
    const response = await request(app)
      .put(`/user/${userName}/${userName2}`);

    expect(response.status).toBe(200);
    expect(response.body).toBe(`${userName2} has followed ${userName}`);
  });

  test('should show all followers of one user', async () => {
    const response = await request(app)
      .get(`/user/${userName}/followers`);

    expect(response.status).toBe(200); // Verifica el estado HTTP
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ userName: userName2 }),
      ])
    );
  });

  test('should unfollow one user to another user', async () => {
    const response = await request(app)
      .put(`/user/${userName}/${userName2}`);

    expect(response.status).toBe(200); // Verifica el estado HTTP
    expect(response.body).toBe(`${userName2} has unfollowed ${userName}`);
  });
});
