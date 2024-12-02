import request from 'supertest';
import app from '../../../src/main/app';  // Ajusta la ruta

describe('Functional Tests for User Search', () => {
  it('should return user details when searching by username', async () => {
    const response = await request(app)
      .get('/user/search')
      .query({ userName: 'newUser' });

    expect(response.status).toBe(200);
    expect(response.body.userName).toBe('newUser');
  });
});
