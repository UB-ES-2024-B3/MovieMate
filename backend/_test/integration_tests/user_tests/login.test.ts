import axios from 'axios';
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";
import {afterAll} from "@jest/globals";

const baseURL = 'http://localhost:3000/user';

describe('Login Tests', () => {
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

  test('should login a user', async () => {
    const response = await axios.post(`${baseURL}/login`, {
      userName: userName,
      password: '1234#User',
    });

    expect(response.status).toBe(200);
    expect(typeof response.data).toBe('string');
    expect(response.data).not.toBe('');
  });

  test('should return 401 for incorrect login credentials', async () => {
    const response = await axios.post(`${baseURL}/login`, {
      userName: 'testuser',
      password: 'WrongPassword',
    }).catch(err => err.response);

    expect(response.status).toBe(401);
    expect(response.data.error.message).toBe('Username or password are incorrect');
  });
});
