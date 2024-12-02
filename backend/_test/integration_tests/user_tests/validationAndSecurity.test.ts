import axios from 'axios';

const baseURL = 'http://localhost:3000/user';

describe('Validation and Security Tests', () => {
  test('should not allow registration with invalid email', async () => {
    await axios.post(`${baseURL}/register`, {
      userName: 'testuser12',
      email: 'notanemail',
      password: 'Password123!',
      birthDate: new Date(),
      gender: 'male',
      isAdmin: false,
    }).catch(err => {
      expect(err.response.status).toBe(400);
      expect(err.response.data.error.message).toBe('Invalid user data!');  // Cambia esto al mensaje real
    });
  });
});

