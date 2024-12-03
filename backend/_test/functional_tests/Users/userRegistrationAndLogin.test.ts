import request from 'supertest';
import app from '../../../src/main/app';  // ruta a app.ts

describe('Functional Tests for User Registration and Login', () => {
  it('should register a new user and login successfully', async () => {
    const registrationResponse = await request(app)
      .post('/user/register')
      .send({
        userName: 'newUser',
        email: 'newuser@example.com',
        password: 'Password123!',
        birthDate: '1990-05-01',
        gender: 'male',
        isAdmin: false,
      });

    expect(registrationResponse.status).toBe(200);
    expect(registrationResponse.body).toEqual({ message: 'Registration successful' });

    const loginResponse = await request(app)
      .post('/user/login')
      .send({
        userName: 'newUser',
        password: 'Password123!',
      });

    expect(loginResponse.status).toBe(200);
    expect(typeof loginResponse.body.token).toBe('string');
  });
});
