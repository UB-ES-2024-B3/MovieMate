import axios from 'axios';
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";
import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';

const baseURL = 'http://localhost:3000/user';

describe('Get Tests', () => {
  let userId: string;
  let userName: string;

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

  afterAll(async () => {
      await deleteTestUser(userName);
  });

  test('should get a user', async () => {
    const response = await axios.get(`${baseURL}/${userName}`);
    expect(response.status).toBe(200);
    userId = response.data.user.id.toString();

    expect(response.data.user.userName).toBe(userName);
    expect(response.data.user.email).toBe('test@example.com');
    expect(response.data.user.birthDate).toBe('2000-01-01');
    expect(response.data.user.gender).toBe('male');
    expect(response.data.user.description).toBeNull();
    expect(response.data.user.isAdmin).toBe(false);
  });

  test('should return 404 for non-existent user', async () => {
    const response = await axios.get(`${baseURL}/nonexistentuser`).catch(err => err.response);
    expect(response.status).toBe(404);
    expect(response.data.error.message).toBe('User with username < nonexistentuser > does not exist');
  });
});
