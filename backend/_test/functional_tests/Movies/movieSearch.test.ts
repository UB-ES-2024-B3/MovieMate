import request from 'supertest';
import app from '../../../src/main/app';  // Ajusta la ruta

describe('Functional Tests for Movie Search', () => {
  it('should return movie details when searching by title', async () => {
    const response = await request(app)
      .get('/movie/search')
      .query({ name: 'Movie 1' });

    expect(response.status).toBe(200);
    expect(response.body._title).toBe('Movie 1');
  });

  it('should return 404 when searching for a non-existent movie', async () => {
    const response = await request(app)
      .get('/movie/search')
      .query({ name: 'NonExistentMovie' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Movie not found');
  });
});
