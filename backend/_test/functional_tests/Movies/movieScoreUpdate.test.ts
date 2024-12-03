import request from 'supertest';
import app from '../../../src/main/app';  // Ajusta la ruta

describe('Functional Tests for Movie Score Update', () => {
  it('should update the score of an existing movie', async () => {
    const response = await request(app)
      .put('/movie/score')
      .send({
        title: 'Movie 1',
        score: 4.8,
      });

    expect(response.status).toBe(200);
    expect(response.body._score).toBe(4.8);
  });

  it('should return an error if the movie does not exist', async () => {
    const response = await request(app)
      .put('/movie/score')
      .send({
        title: 'NonExistentMovie',
        score: 4.8,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Movie not found');
  });
});
