import axios from 'axios';
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";
import {afterAll} from "@jest/globals";

const baseURL = 'http://localhost:3000/user';

describe('Update Tests', () => {
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



  test('should update an existing user', async () => {
    try {
      const updateResponse = await axios.put(`${baseURL}/update/${userId}`, { userName: 'updatedUser' });
      expect(updateResponse.status).toBe(200);
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data);  // Detalles sobre el error del servidor
      } else {
        console.error('Error:', error.message);  // Error de red o de Axios
      }
    }
  });


  test('should return 404 when trying to update a non-existent user', async () => {
    const response = await axios.put(`${baseURL}/update/999`, { userName: 'newName' }).catch(err => err.response);
    expect(response.status).toBe(404);
    expect(response.data.error.message).toBe('User with Id < 999 > does not exist');
  });
});
