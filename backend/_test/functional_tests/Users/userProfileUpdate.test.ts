import request from 'supertest';
import app from '../../../src/main/app'; // Ajusta la ruta

describe('Functional Tests for User Profile Update', () => {
  let userToken: string;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/user/login')
      .send({ userName: 'testUser', password: 'Password123!' });
    userToken = loginResponse.body.token;
  });

  it('should allow the user to update their profile', async () => {
    const updatedData = { userName: 'updatedTestUser', email: 'updated@example.com' };

    const response = await request(app)
      .put('/user/update/testUser')  // Asegúrate de usar un userId válido
      .set('Authorization', `Bearer ${userToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User profile updated');
    expect(response.body.data.userName).toBe(updatedData.userName);
  });
});
