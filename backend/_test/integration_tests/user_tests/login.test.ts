import axios from 'axios';

const baseURL = 'http://localhost:3000/user';

describe('Login Tests', () => {
  test('should login a user', async () => {
    const response = await axios.post(`${baseURL}/login`, {
      userName: 'testuser',
      password: 'Password123!',
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
