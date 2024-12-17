import request from 'supertest';
import app from '../../../src/main/app';
import {PostgreTypeOrmDataSource} from "../../../src/main/config/postgreDatabaseTypeOrm";
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";
import {createTestMovie, deleteTestMovie, getTestMovie} from "../../test_utils/testUtilsMovies";
import {afterAll, beforeAll, expect, it} from "@jest/globals";  // Ajusta la ruta

describe('Functional Tests for Movie Favorites', () => {
  let userToken: string;
  let userId: string;
  let movieId: string;
  let existingUser;
  let userName: string;

  beforeAll(async () => {
    if (!PostgreTypeOrmDataSource.isInitialized) {
        await PostgreTypeOrmDataSource.initialize();
    }

    const existingMovie = await getTestMovie('TestMovie');
    if (!existingMovie) {
        const movie = await createTestMovie();
        movieId = movie.movie._id;
    } else {
        movieId = existingMovie.movie._id;
    }

    const existingUser = await getUserTest('TestUser');
    if (!existingUser) {
        const user = await createTestUser();
        userId = user.user.id;
        userName = user.user.userName;
    } else {
        userId = existingUser.user.id;
        userName = existingUser.user.userName;
    }

    const loginResponse = await request(app)
      .post('/user/login')
      .send({
        userName: 'TestUser',
        password: '1234#User',
      });
    userToken = loginResponse.body;
  });

  afterAll(async () => {
      if (PostgreTypeOrmDataSource.isInitialized) {
          await PostgreTypeOrmDataSource.destroy();
      }
      await deleteTestUser(userName);
      await deleteTestMovie(movieId);
  });

  it('should add a movie to favorites', async () => {
    const response = await request(app)
      .put('/movie/favorites')
      .send({ userName, idMovie: movieId, });

    expect(response.status).toBe(200);
    expect(response.body).toBe('Movie added to favorites');
  });

  it('should remove a movie from favorites', async () => {
    const response = await request(app)
      .put('/movie/favorites')
      .send({ userName, idMovie: movieId, });

    expect(response.status).toBe(200);
    expect(response.body).toBe('Movie removed from favorites');
  });
});
