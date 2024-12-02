import request from 'supertest';
import app from '../../../src/main/app';  // Ajusta la ruta

describe('Functional Tests for Movie Favorites', () => {
  let userToken: string;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/user/login')
      .send({ userName: 'testUser', password: 'Password123!' });
    userToken = loginResponse.body.token;
  });

  it('should add a movie to favorites', async () => {
    const response = await request(app)
      .put('/movie/favorites')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Movie 1' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Movie added to favorites');
  });

  it('should remove a movie from favorites', async () => {
    const response = await request(app)
      .put('/movie/favorites')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Movie 1', remove: true });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Movie removed from favorites');
  });
});
