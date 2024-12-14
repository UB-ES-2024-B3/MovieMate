import axios from 'axios';
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";
import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';

const baseURL = 'http://localhost:3000/user';

describe('Followers Test', () => {
  let userName: string;
  let userId: string;
  let userName2: string;
  let userId2: string;

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
      await deleteTestUser(userName);
      await deleteTestUser(userName2);
  });


  test('should follow one user to another user', async () => {
    try {
      const followerResponse = await axios.put(`${baseURL}/${userName}/${userName2}`);

      expect(followerResponse.status).toBe(200);
      expect(followerResponse.data).toBe(`${userName2} has followed ${userName}`);

    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  });

  test('should show all followers of one user', async () => {
    try {
      const followListResponse = await axios.get(`${baseURL}/${userName}/followers`);

      expect(followListResponse.status).toBe(200);
      expect(followListResponse.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ userName: userName2 }),
        ])
      );
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  });

  test('should unfollow one user to another user', async () => {
    try {
      const unfollowerResponse = await axios.put(`${baseURL}/${userName}/${userName2}`);

      expect(unfollowerResponse.status).toBe(200);
      expect(unfollowerResponse.data).toBe(`${userName2} has unfollowed ${userName}`);

    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  });
});
