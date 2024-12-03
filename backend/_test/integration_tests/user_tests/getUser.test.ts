import axios from 'axios';

const baseURL = 'http://localhost:3000/user';

describe('Get Tests', () => {
  let userId: string;

  test('should get a user', async () => {
    const response = await axios.get(`${baseURL}/testuser`);
    expect(response.status).toBe(200);
    userId = response.data.user.id.toString();

    expect(response.data.user.userName).toBe('testuser');
    expect(response.data.user.email).toBe('test@example.com');
    expect(response.data.user.birthDate).toBe('2002-11-17');
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
